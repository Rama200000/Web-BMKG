/**
 * Professional PDF Export Utility — Si Iklim Muda BMKG
 * ═════════════════════════════════════════════════════
 * Generates standards-compliant, government-grade PDF reports with:
 * - Official BMKG letterhead and institutional branding
 * - Document metadata (classification, reference number, date)
 * - Executive summary and methodology notes
 * - High-quality charts rendered via canvas
 * - Styled tables with conditional formatting
 * - Interpretation guidelines and category legends
 * - Signature block and confidentiality footer
 * - Watermark, page numbering, and consistent typography
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Color Palette ──────────────────────────────────────────────────────────
const C = {
  primary:      [13,  71, 161],   // #0D47A1 — BMKG official deep blue
  primaryMid:   [25,  118, 210],  // #1976D2
  primaryLight: [227, 242, 253],  // #E3F2FD
  accent:       [2,   119, 89],   // #027759 — green
  accentLight:  [232, 245, 233],  // #E8F5E9
  dark:         [33,  37,  41],   // #212529
  gray700:      [55,  65,  81],   // #374151
  gray600:      [75,  85,  99],   // #4B5563
  gray500:      [107, 114, 128],  // #6B7280
  gray400:      [156, 163, 175],  // #9CA3AF
  gray300:      [209, 213, 219],  // #D1D5DB
  gray200:      [229, 231, 235],  // #E5E7EB
  gray100:      [243, 244, 246],  // #F3F4F6
  gray50:       [249, 250, 251],  // #F9FAFB
  white:        [255, 255, 255],
  red:          [185, 28,  28],   // #B91C1C
  amber:        [180, 83,  9],    // #B45309
  green:        [21,  128, 61],   // #15803D
  gold:         [202, 138, 4],    // #CA8A04
};

const MARGIN = 18;    // mm — generous margin for official feel
const MARGIN_R = 18;

// ── Helpers ────────────────────────────────────────────────────────────────

/** Convert a local image URL to base64 data-URL via canvas. */
export async function imageToBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function formatTanggal(d = new Date()) {
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

function formatWaktu(d = new Date()) {
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function generateDocNumber() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `SIM/${seq}/RPT/${mm}.${yy}`;
}

/** Safe page-break check: adds new page if remaining space < needed. Returns the new Y. */
function ensureSpace(doc, y, needed) {
  const pageH = doc.internal.pageSize.getHeight();
  if (y + needed > pageH - 25) {
    doc.addPage();
    return 22;
  }
  return y;
}

// ── Watermark ──────────────────────────────────────────────────────────────

function drawWatermark(doc) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const totalPages = doc.internal.getNumberOfPages();

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.035 }));
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(54);
    doc.setTextColor(...C.primary);
    doc.text('BMKG', pageW / 2, pageH / 2, {
      align: 'center',
      angle: 35,
    });
    doc.restoreGraphicsState();
  }
}

// ── Official Letterhead ────────────────────────────────────────────────────

function drawOfficialLetterhead(doc, logoBase64, { title, subtitle, docNumber, klasifikasi }) {
  const pageW = doc.internal.pageSize.getWidth();

  // ── Top blue band
  doc.setFillColor(...C.primary);
  doc.rect(0, 0, pageW, 5, 'F');

  // ── Thin gold accent below the blue band
  doc.setFillColor(...C.gold);
  doc.rect(0, 5, pageW, 1.2, 'F');

  let y = 14;

  // ── Logo
  if (logoBase64) {
    try { doc.addImage(logoBase64, 'PNG', MARGIN, y - 1, 16, 16); } catch (_) { /* ignore */ }
  }

  // ── Institution name block
  const textX = logoBase64 ? MARGIN + 20 : MARGIN;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...C.dark);
  doc.text('BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA', textX, y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.gray600);
  doc.text('Republik Indonesia', textX, y + 10);

  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray500);
  doc.text('Si Iklim Muda — Sistem Informasi Literasi Iklim untuk Generasi Muda', textX, y + 15);
  y += 20;

  // ── Double-line separator (government style)
  doc.setDrawColor(...C.primary);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, y, pageW - MARGIN_R, y);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y + 1.5, pageW - MARGIN_R, y + 1.5);
  y += 6;

  // ── Document metadata row
  const metaY = y;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.gray500);

  if (docNumber) {
    doc.text(`No. Dokumen: ${docNumber}`, MARGIN, metaY);
  }
  if (klasifikasi) {
    const klasLabel = `Klasifikasi: ${klasifikasi}`;
    doc.text(klasLabel, pageW - MARGIN_R, metaY, { align: 'right' });
  }

  doc.text(`Tanggal Cetak: ${formatTanggal()} — ${formatWaktu()} WIB`, MARGIN, metaY + 4.5);
  y = metaY + 10;

  // ── Report title block with background
  doc.setFillColor(...C.primaryLight);
  doc.roundedRect(MARGIN, y, pageW - MARGIN - MARGIN_R, subtitle ? 18 : 14, 2, 2, 'F');

  doc.setFillColor(...C.primary);
  doc.rect(MARGIN, y, 3, subtitle ? 18 : 14, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...C.primary);
  doc.text(title, MARGIN + 8, y + (subtitle ? 8 : 9.5));

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.gray600);
    doc.text(subtitle, MARGIN + 8, y + 14.5);
  }

  y += (subtitle ? 18 : 14) + 6;
  return y;
}

// ── Executive Summary Box ──────────────────────────────────────────────────

function drawExecutiveSummary(doc, y, text) {
  const pageW = doc.internal.pageSize.getWidth();
  const contentW = pageW - MARGIN - MARGIN_R - 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.gray700);
  doc.text('RINGKASAN EKSEKUTIF', MARGIN, y);
  y += 4;

  doc.setFillColor(...C.gray50);
  doc.setDrawColor(...C.gray300);
  doc.setLineWidth(0.3);

  const lines = doc.setFont('helvetica', 'normal').setFontSize(7.5).splitTextToSize(text, contentW);
  const boxH = lines.length * 3.5 + 8;

  doc.roundedRect(MARGIN, y, pageW - MARGIN - MARGIN_R, boxH, 2, 2, 'FD');

  // Left accent line
  doc.setFillColor(...C.primaryMid);
  doc.rect(MARGIN + 0.5, y + 2, 1.5, boxH - 4, 'F');

  doc.setTextColor(...C.gray700);
  doc.text(lines, MARGIN + 6, y + 5.5);

  return y + boxH + 5;
}

// ── Section Header ─────────────────────────────────────────────────────────

function drawSectionTitle(doc, y, number, title) {
  y = ensureSpace(doc, y, 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...C.primary);

  const label = number ? `${number}. ${title}` : title;
  doc.text(label, MARGIN, y);

  // Underline
  doc.setDrawColor(...C.primary);
  doc.setLineWidth(0.5);
  const textW = doc.getTextWidth(label);
  doc.line(MARGIN, y + 1.5, MARGIN + textW + 2, y + 1.5);

  return y + 7;
}

// ── Statistics Cards ───────────────────────────────────────────────────────

function drawStatCards(doc, y, stats) {
  const pageW = doc.internal.pageSize.getWidth();
  const count = stats.length;
  const gap = 4;
  const totalW = pageW - MARGIN - MARGIN_R;
  const cardW = (totalW - (count - 1) * gap) / count;
  const cardH = 22;

  y = ensureSpace(doc, y, cardH + 8);

  stats.forEach((stat, i) => {
    const x = MARGIN + i * (cardW + gap);
    const bg = stat.bg || C.gray50;
    const border = stat.border || C.gray400;

    // Card background
    doc.setFillColor(...bg);
    doc.setDrawColor(...C.gray200);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, cardW, cardH, 2, 2, 'FD');

    // Top border accent
    doc.setFillColor(...border);
    doc.rect(x + 4, y, cardW - 8, 1.5, 'F');

    // Label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...C.gray500);
    doc.text(stat.label.toUpperCase(), x + cardW / 2, y + 7, { align: 'center' });

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...C.dark);
    const valStr = String(stat.value);
    doc.text(valStr, x + cardW / 2, y + 16, { align: 'center' });

    // Unit suffix
    if (stat.unit) {
      const valW = doc.getTextWidth(valStr);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...C.gray500);
      doc.text(stat.unit, x + cardW / 2 + valW / 2 + 1.5, y + 16);
    }
  });

  return y + cardH + 5;
}

// ── Bar Chart (Canvas → Image) ─────────────────────────────────────────────

function renderBarChart(chartData, options = {}) {
  const {
    width = 700,
    height = 300,
    labelKey = 'label',
    bars = [{ key: 'value1', label: 'Pre-Test', color: '#0D47A1' }, { key: 'value2', label: 'Post-Test', color: '#027759' }],
  } = options;

  const canvas = document.createElement('canvas');
  const dpr = 2;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  const padL = 52, padR = 28, padT = 44, padB = 60;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  // Max value
  let maxVal = 0;
  chartData.forEach(d => bars.forEach(b => {
    const v = parseFloat(d[b.key]) || 0;
    if (v > maxVal) maxVal = v;
  }));
  maxVal = Math.ceil(maxVal / 10) * 10 || 100;

  // Grid lines + Y-axis labels
  const steps = 5;
  ctx.strokeStyle = '#F1F5F9';
  ctx.lineWidth = 0.8;
  ctx.font = '11px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.textAlign = 'right';
  for (let i = 0; i <= steps; i++) {
    const val = Math.round((maxVal / steps) * i);
    const yPos = padT + chartH - (chartH * i / steps);
    ctx.beginPath();
    ctx.moveTo(padL, yPos);
    ctx.lineTo(padL + chartW, yPos);
    ctx.stroke();
    ctx.fillText(val.toString(), padL - 8, yPos + 4);
  }

  // Axis lines
  ctx.strokeStyle = '#D1D5DB';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + chartH);
  ctx.lineTo(padL + chartW, padT + chartH);
  ctx.stroke();

  // Bars
  const groupW = chartW / chartData.length;
  const barCount = bars.length;
  const barGap = 4;
  const totalBarW = Math.min(groupW * 0.6, 44 * barCount);
  const singleBarW = (totalBarW - (barCount - 1) * barGap) / barCount;

  chartData.forEach((d, i) => {
    const groupX = padL + i * groupW + (groupW - totalBarW) / 2;

    bars.forEach((b, j) => {
      const val = parseFloat(d[b.key]) || 0;
      const barH = (val / maxVal) * chartH;
      const bx = groupX + j * (singleBarW + barGap);
      const by = padT + chartH - barH;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.04)';
      ctx.fillRect(bx + 2, by + 2, singleBarW, barH);

      // Bar with subtle gradient
      const grad = ctx.createLinearGradient(bx, by, bx, padT + chartH);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, b.color + 'CC');
      ctx.fillStyle = grad;

      // Rounded top
      const r = 3;
      ctx.beginPath();
      ctx.moveTo(bx, by + r);
      ctx.arcTo(bx, by, bx + r, by, r);
      ctx.arcTo(bx + singleBarW, by, bx + singleBarW, by + r, r);
      ctx.lineTo(bx + singleBarW, padT + chartH);
      ctx.lineTo(bx, padT + chartH);
      ctx.closePath();
      ctx.fill();

      // Value label above bar
      if (val > 0) {
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 10px "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(Number.isInteger(val) ? val.toString() : val.toFixed(1), bx + singleBarW / 2, by - 5);
      }
    });

    // X-axis label (with word wrapping)
    const labelText = String(d[labelKey]);
    const labelX = padL + i * groupW + groupW / 2;
    ctx.fillStyle = '#6B7280';
    ctx.font = '10px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';

    if (labelText.length > 14) {
      const words = labelText.split(' ');
      let line1 = '', line2 = '';
      for (const w of words) {
        if ((line1 + ' ' + w).trim().length <= 14) line1 = (line1 + ' ' + w).trim();
        else line2 = (line2 + ' ' + w).trim();
      }
      ctx.fillText(line1, labelX, padT + chartH + 16);
      if (line2) ctx.fillText(line2, labelX, padT + chartH + 28);
    } else {
      ctx.fillText(labelText, labelX, padT + chartH + 18);
    }
  });

  // Legend
  let legendX = padL;
  const legendY = 16;
  ctx.font = '11px "Segoe UI", system-ui, sans-serif';
  bars.forEach(b => {
    // Rounded rect legend swatch
    ctx.fillStyle = b.color;
    const swatchW = 14, swatchH = 10;
    ctx.beginPath();
    ctx.roundRect(legendX, legendY - 7, swatchW, swatchH, 2);
    ctx.fill();

    ctx.fillStyle = '#374151';
    ctx.textAlign = 'left';
    ctx.fillText(b.label, legendX + swatchW + 4, legendY + 1);
    legendX += ctx.measureText(b.label).width + swatchW + 20;
  });

  return canvas.toDataURL('image/png');
}

// ── Table Theme ────────────────────────────────────────────────────────────

const TABLE_THEME = {
  headStyles: {
    fillColor: C.primary,
    textColor: C.white,
    fontStyle: 'bold',
    fontSize: 7.5,
    halign: 'center',
    cellPadding: { top: 4.5, bottom: 4.5, left: 3, right: 3 },
  },
  bodyStyles: {
    fontSize: 7.5,
    textColor: C.dark,
    cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 },
  },
  alternateRowStyles: {
    fillColor: C.gray50,
  },
  styles: {
    lineColor: C.gray200,
    lineWidth: 0.25,
    overflow: 'linebreak',
    font: 'helvetica',
  },
  tableLineColor: C.gray200,
  tableLineWidth: 0.25,
  margin: { left: MARGIN, right: MARGIN_R },
};

// ── Interpretation Legend ──────────────────────────────────────────────────

function drawNGainLegend(doc, y) {
  const pageW = doc.internal.pageSize.getWidth();
  y = ensureSpace(doc, y, 35);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray700);
  doc.text('Pedoman Interpretasi Normalized Gain (N-Gain):', MARGIN, y);
  y += 5;

  const categories = [
    { range: 'N-Gain ≥ 70%',       label: 'Tinggi',   color: C.green },
    { range: '30% ≤ N-Gain < 70%', label: 'Sedang',   color: C.gold },
    { range: 'N-Gain < 30%',       label: 'Rendah',   color: C.red },
  ];

  doc.setFillColor(...C.gray50);
  doc.setDrawColor(...C.gray200);
  doc.roundedRect(MARGIN, y, pageW - MARGIN - MARGIN_R, 20, 2, 2, 'FD');

  const colW = (pageW - MARGIN - MARGIN_R) / 3;
  categories.forEach((cat, i) => {
    const x = MARGIN + i * colW + 6;

    // Color dot
    doc.setFillColor(...cat.color);
    doc.circle(x + 2, y + 10, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...cat.color);
    doc.text(cat.label, x + 7, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gray600);
    doc.text(cat.range, x + 7, y + 14);
  });

  return y + 25;
}

// ── Methodology Note ───────────────────────────────────────────────────────

function drawMethodologyNote(doc, y) {
  y = ensureSpace(doc, y, 22);
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFillColor(...C.primaryLight);
  doc.setDrawColor(...C.primaryMid);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, pageW - MARGIN - MARGIN_R, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.primary);
  doc.text('CATATAN METODOLOGI', MARGIN + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.gray700);
  doc.text(
    'Peningkatan pemahaman dihitung menggunakan rumus Normalized Gain (N-Gain) oleh Hake (1998): g = (Spost − Spre) / (Smaks − Spre).',
    MARGIN + 4, y + 10
  );

  return y + 20;
}

// ── Signature Block ────────────────────────────────────────────────────────

function drawSignatureBlock(doc, y) {
  const pageW = doc.internal.pageSize.getWidth();
  y = ensureSpace(doc, y, 50);

  // Right-aligned block
  const blockX = pageW - MARGIN_R - 70;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray700);
  doc.text(`Bandung, ${formatTanggal()}`, blockX, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.text('Mengetahui,', blockX, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.text('Koordinator Si Iklim Muda BMKG', blockX, y);
  y += 22;

  // Signature line
  doc.setDrawColor(...C.gray400);
  doc.setLineWidth(0.3);
  doc.line(blockX, y, blockX + 60, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.gray500);
  doc.text('(................................)', blockX, y);

  return y + 8;
}

// ── Footer ─────────────────────────────────────────────────────────────────

function drawFooter(doc) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const totalPages = doc.internal.getNumberOfPages();

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Bottom accent bar
    doc.setFillColor(...C.primary);
    doc.rect(0, pageH - 4, pageW, 4, 'F');

    // Separator line
    doc.setDrawColor(...C.gray300);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, pageH - 14, pageW - MARGIN_R, pageH - 14);

    // Left: confidentiality
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6);
    doc.setTextColor(...C.gray400);
    doc.text('Dokumen ini dihasilkan secara otomatis oleh sistem Si Iklim Muda — BMKG. Hanya untuk keperluan internal.', MARGIN, pageH - 9);

    // Right: page number
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gray500);
    doc.text(`Hal. ${p} / ${totalPages}`, pageW - MARGIN_R, pageH - 9, { align: 'right' });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC EXPORT: Dashboard PDF — Rekapitulasi Nilai per Sekolah
// ═══════════════════════════════════════════════════════════════════════════

export async function exportDashboardPDF({ chartData, sekolahList, totalSiswa, totalModul, totalDinilai, avgSkor, selectedCakupan, logoUrl }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let logoBase64 = null;
  try { logoBase64 = await imageToBase64(logoUrl); } catch (_) {}

  let filteredData = chartData;
  if (selectedCakupan && selectedCakupan !== 'Semua') {
    filteredData = chartData.filter(s => s.skor === selectedCakupan);
  }

  const docNumber = generateDocNumber();

  // ── Page 1: Letterhead
  let y = drawOfficialLetterhead(doc, logoBase64, {
    title: 'LAPORAN REKAPITULASI NILAI PRE-TEST & POST-TEST',
    subtitle: selectedCakupan !== 'Semua' ? `Cakupan: ${selectedCakupan}` : 'Cakupan: Seluruh Sekolah',
    docNumber,
    klasifikasi: 'Internal — Terbatas',
  });

  // ── Executive Summary
  const summaryText = `Laporan ini menyajikan hasil evaluasi literasi iklim siswa yang mengikuti program Si Iklim Muda BMKG. `
    + `Total ${totalSiswa} siswa terdaftar dari ${filteredData.length} sekolah, dengan ${totalDinilai} siswa telah menyelesaikan evaluasi. `
    + `Rata-rata skor keseluruhan tercatat sebesar ${avgSkor}. `
    + `Data dihimpun melalui Pre-Test (sebelum pembelajaran) dan Post-Test (setelah pembelajaran) untuk mengukur efektivitas program.`;
  y = drawExecutiveSummary(doc, y, summaryText);

  // ── Section 1: Statistik Umum
  y = drawSectionTitle(doc, y, '1', 'Statistik Umum');
  y = drawStatCards(doc, y, [
    { label: 'Total Siswa Terdaftar', value: totalSiswa, bg: C.primaryLight, border: C.primary },
    { label: 'Modul Aktif', value: totalModul, bg: C.accentLight, border: C.accent },
    { label: 'Siswa Telah Dinilai', value: totalDinilai, bg: [224, 231, 255], border: [99, 102, 241] },
    { label: 'Rata-rata Skor', value: avgSkor, bg: [254, 243, 199], border: [180, 83, 9] },
  ]);

  // ── Section 2: Grafik Perbandingan
  if (filteredData.length > 0) {
    y = drawSectionTitle(doc, y, '2', 'Grafik Perbandingan Rata-Rata Nilai per Sekolah');

    const chartImg = renderBarChart(
      filteredData.map(d => ({ label: d.skor, value1: d.pretest, value2: d.posttest })),
      {
        labelKey: 'label',
        bars: [
          { key: 'value1', label: 'Pre-Test', color: '#0D47A1' },
          { key: 'value2', label: 'Post-Test', color: '#027759' },
        ],
      }
    );

    const pageW = doc.internal.pageSize.getWidth();
    const chartW = pageW - MARGIN - MARGIN_R;
    const chartH = chartW * 0.42;

    y = ensureSpace(doc, y, chartH + 12);
    doc.addImage(chartImg, 'PNG', MARGIN, y, chartW, chartH);
    y += chartH + 3;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gray400);
    doc.text('Gambar 1 — Grafik perbandingan rata-rata nilai Pre-Test dan Post-Test per sekolah (skala 0–100).', MARGIN, y);
    y += 7;
  }

  // ── Section 3: Tabel Rekapitulasi
  y = drawSectionTitle(doc, y, '3', 'Tabel Rekapitulasi per Sekolah');

  const tableData = filteredData.map((s, index) => {
    const sch = sekolahList.find(x => x.nama === s.skor);
    const pre = parseFloat(s.pretest) || 0;
    const post = parseFloat(s.posttest) || 0;
    const delta = post - pre;
    const nGain = pre < 100 ? (((post - pre) / (100 - pre)) * 100).toFixed(1) : (post === 100 ? '100.0' : '0.0');
    return [
      index + 1,
      s.skor,
      sch ? sch.jumlah_siswa : '-',
      pre.toFixed(1),
      post.toFixed(1),
      (delta >= 0 ? '+' : '') + delta.toFixed(1),
      nGain + '%',
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['No', 'Nama Sekolah', 'Jml.\nSiswa', 'Rata-rata\nPre-Test', 'Rata-rata\nPost-Test', 'Selisih\n(Δ)', 'N-Gain\n(%)']],
    body: tableData,
    ...TABLE_THEME,
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      2: { halign: 'center', cellWidth: 16 },
      3: { halign: 'center', cellWidth: 22 },
      4: { halign: 'center', cellWidth: 22 },
      5: { halign: 'center', cellWidth: 16 },
      6: { halign: 'center', cellWidth: 16 },
    },
    didParseCell(data) {
      if (data.section === 'body') {
        if (data.column.index === 5) {
          const v = parseFloat(data.cell.raw);
          data.cell.styles.textColor = v >= 0 ? C.accent : C.red;
          data.cell.styles.fontStyle = 'bold';
        }
        if (data.column.index === 6) {
          const v = parseFloat(data.cell.raw);
          if (v >= 70) data.cell.styles.textColor = C.green;
          else if (v >= 30) data.cell.styles.textColor = C.gold;
          else data.cell.styles.textColor = C.red;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  // ── Summary row
  if (filteredData.length > 0) {
    const avgPre = (filteredData.reduce((s, d) => s + (parseFloat(d.pretest) || 0), 0) / filteredData.length).toFixed(1);
    const avgPost = (filteredData.reduce((s, d) => s + (parseFloat(d.posttest) || 0), 0) / filteredData.length).toFixed(1);
    const avgDelta = (parseFloat(avgPost) - parseFloat(avgPre)).toFixed(1);

    let finalY = doc.lastAutoTable.finalY + 2;
    const pageW = doc.internal.pageSize.getWidth();
    doc.setFillColor(...C.primary);
    doc.roundedRect(MARGIN, finalY, pageW - MARGIN - MARGIN_R, 9, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.white);
    doc.text(
      `RATA-RATA KESELURUHAN      Pre-Test: ${avgPre}    |    Post-Test: ${avgPost}    |    Selisih: ${avgDelta >= 0 ? '+' : ''}${avgDelta}`,
      MARGIN + 5, finalY + 6
    );
    finalY += 14;

    // N-Gain Legend
    finalY = drawNGainLegend(doc, finalY);

    // Methodology note
    finalY = drawMethodologyNote(doc, finalY);

    // Signature
    drawSignatureBlock(doc, finalY);
  }

  drawWatermark(doc);
  drawFooter(doc);
  doc.save(`Laporan_Dashboard_SiIklimMuda_${docNumber.replace(/\//g, '-')}.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC EXPORT: Hasil Skor PDF — Detail Per-Siswa
// ═══════════════════════════════════════════════════════════════════════════

export async function exportHasilSkorPDF({ hasilSkorData, stats, selectedCakupan, logoUrl }) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  let logoBase64 = null;
  try { logoBase64 = await imageToBase64(logoUrl); } catch (_) {}

  const filteredData = selectedCakupan === 'Semua'
    ? hasilSkorData
    : hasilSkorData.filter(item => item.sekolah === selectedCakupan);

  const docNumber = generateDocNumber();

  // ── Letterhead
  let y = drawOfficialLetterhead(doc, logoBase64, {
    title: 'LAPORAN HASIL SKOR PRE-TEST & POST-TEST SISWA',
    subtitle: selectedCakupan !== 'Semua' ? `Filter Sekolah: ${selectedCakupan}` : 'Seluruh Sekolah',
    docNumber,
    klasifikasi: 'Internal — Terbatas',
  });

  // ── Executive Summary
  const summaryText = `Dokumen ini memuat evaluasi komparatif pemahaman literasi iklim per individu siswa, mencakup ${filteredData.length} peserta. `
    + `Rata-rata skor Pre-Test: ${stats.avgPreTest}, Post-Test: ${stats.avgPostTest}, dengan N-Gain rata-rata sebesar ${stats.nGain}%. `
    + `Data ini digunakan untuk mengidentifikasi efektivitas program pembelajaran serta siswa yang memerlukan perhatian khusus.`;
  y = drawExecutiveSummary(doc, y, summaryText);

  // ── Section 1: Statistik
  y = drawSectionTitle(doc, y, '1', 'Statistik Evaluasi');
  y = drawStatCards(doc, y, [
    { label: 'Rata-rata Pre-Test', value: stats.avgPreTest, bg: C.gray100, border: C.gray500 },
    { label: 'Rata-rata Post-Test', value: stats.avgPostTest, bg: C.primaryLight, border: C.primary },
    { label: 'Rata-rata N-Gain', value: stats.nGain, unit: '%', bg: C.accentLight, border: C.accent },
    { label: 'Total Peserta', value: stats.totalPeserta, bg: [252, 231, 243], border: [190, 24, 93] },
  ]);

  // ── Section 2: Grafik
  const schoolMap = {};
  filteredData.forEach(d => {
    if (!schoolMap[d.sekolah]) schoolMap[d.sekolah] = { pre: [], post: [] };
    schoolMap[d.sekolah].pre.push(d.preTest);
    schoolMap[d.sekolah].post.push(d.postTest);
  });
  const schoolChartData = Object.entries(schoolMap).map(([name, v]) => ({
    label: name,
    value1: (v.pre.reduce((a, b) => a + b, 0) / v.pre.length).toFixed(1),
    value2: (v.post.reduce((a, b) => a + b, 0) / v.post.length).toFixed(1),
  }));

  if (schoolChartData.length > 0) {
    y = drawSectionTitle(doc, y, '2', 'Grafik Rata-Rata Nilai per Sekolah');
    const chartImg = renderBarChart(schoolChartData, {
      width: 900,
      height: 260,
      labelKey: 'label',
      bars: [
        { key: 'value1', label: 'Pre-Test', color: '#0D47A1' },
        { key: 'value2', label: 'Post-Test', color: '#027759' },
      ],
    });
    const pageW = doc.internal.pageSize.getWidth();
    const chartW = pageW - MARGIN - MARGIN_R;
    const chartH = chartW * 0.28;
    y = ensureSpace(doc, y, chartH + 10);
    doc.addImage(chartImg, 'PNG', MARGIN, y, chartW, chartH);
    y += chartH + 3;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gray400);
    doc.text('Gambar 1 — Rata-rata nilai Pre-Test dan Post-Test berdasarkan asal sekolah.', MARGIN, y);
    y += 7;
  }

  // ── Section 3: Data Detail
  y = drawSectionTitle(doc, y, '3', `Data Detail Skor Siswa (${filteredData.length} peserta)`);

  const tableRows = filteredData.map((item, idx) => [
    idx + 1,
    item.nama,
    item.hp || '-',
    item.sekolah,
    item.kelas,
    item.preTest,
    item.postTest,
    (item.postTest - item.preTest >= 0 ? '+' : '') + (item.postTest - item.preTest),
    (item.peningkatan > 0 ? '+' : '') + item.peningkatan + '%',
  ]);

  autoTable(doc, {
    startY: y,
    head: [['No', 'Nama Siswa', 'No. HP', 'Asal Sekolah', 'Kelas', 'Pre-Test', 'Post-Test', 'Selisih (Δ)', 'N-Gain (%)']],
    body: tableRows,
    ...TABLE_THEME,
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 42 },
      2: { cellWidth: 28 },
      4: { halign: 'center', cellWidth: 18 },
      5: { halign: 'center', cellWidth: 18 },
      6: { halign: 'center', cellWidth: 18 },
      7: { halign: 'center', cellWidth: 18 },
      8: { halign: 'center', cellWidth: 18 },
    },
    didParseCell(data) {
      if (data.section === 'body') {
        if (data.column.index === 7) {
          const v = parseFloat(data.cell.raw);
          data.cell.styles.textColor = v >= 0 ? C.accent : C.red;
          data.cell.styles.fontStyle = 'bold';
        }
        if (data.column.index === 8) {
          const v = parseFloat(data.cell.raw);
          if (v >= 70) data.cell.styles.textColor = C.green;
          else if (v >= 30) data.cell.styles.textColor = C.gold;
          else data.cell.styles.textColor = C.red;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  // ── Summary bar
  let finalY = doc.lastAutoTable.finalY + 2;
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFillColor(...C.primary);
  doc.roundedRect(MARGIN, finalY, pageW - MARGIN - MARGIN_R, 9, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.white);
  doc.text(
    `RINGKASAN      Pre-Test: ${stats.avgPreTest}    |    Post-Test: ${stats.avgPostTest}    |    N-Gain: ${stats.nGain}%    |    Total Peserta: ${stats.totalPeserta}`,
    MARGIN + 5, finalY + 6
  );
  finalY += 14;

  // N-Gain Legend & Methodology
  finalY = drawNGainLegend(doc, finalY);
  finalY = drawMethodologyNote(doc, finalY);
  drawSignatureBlock(doc, finalY);

  drawWatermark(doc);
  drawFooter(doc);
  doc.save(`Laporan_Hasil_Skor_${docNumber.replace(/\//g, '-')}.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC EXPORT: Modul PDF — Data Modul Pembelajaran
// ═══════════════════════════════════════════════════════════════════════════

export async function exportModulPDF({ modules, logoUrl }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let logoBase64 = null;
  try { logoBase64 = await imageToBase64(logoUrl); } catch (_) {}

  const docNumber = generateDocNumber();

  // ── Letterhead
  let y = drawOfficialLetterhead(doc, logoBase64, {
    title: 'LAPORAN DATA MODUL PEMBELAJARAN',
    subtitle: 'Program Literasi Iklim untuk Generasi Muda',
    docNumber,
    klasifikasi: 'Internal',
  });

  // ── Executive Summary
  const totalModul = modules.length;
  const totalSoal = modules.reduce((s, m) => s + parseInt(m.jumlah_soal || 0), 0);
  const categories = [...new Set(modules.map(m => m.kategori || 'Umum'))];

  const summaryText = `Dokumen ini memuat daftar lengkap modul pembelajaran literasi iklim yang tersedia dalam sistem Si Iklim Muda BMKG. `
    + `Saat ini terdapat ${totalModul} modul aktif dengan total ${totalSoal} butir soal evaluasi, mencakup ${categories.length} kategori materi. `
    + `Modul-modul ini dirancang untuk meningkatkan pemahaman generasi muda terhadap perubahan iklim dan adaptasinya.`;
  y = drawExecutiveSummary(doc, y, summaryText);

  // ── Section 1: Statistik
  y = drawSectionTitle(doc, y, '1', 'Statistik Modul');
  y = drawStatCards(doc, y, [
    { label: 'Total Modul Aktif', value: totalModul, bg: C.primaryLight, border: C.primary },
    { label: 'Total Butir Soal', value: totalSoal, unit: 'soal', bg: C.accentLight, border: C.accent },
    { label: 'Jumlah Kategori', value: categories.length, bg: [224, 231, 255], border: [99, 102, 241] },
  ]);

  // ── Section 2: Distribusi Soal
  if (modules.length > 0) {
    y = drawSectionTitle(doc, y, '2', 'Distribusi Jumlah Soal per Modul');
    const chartImg = renderBarChart(
      modules.map(m => ({
        label: m.judul.length > 20 ? m.judul.substring(0, 18) + '…' : m.judul,
        value1: parseInt(m.jumlah_soal) || 0,
      })),
      {
        labelKey: 'label',
        bars: [{ key: 'value1', label: 'Jumlah Soal', color: '#0D47A1' }],
      }
    );
    const pageW = doc.internal.pageSize.getWidth();
    const chartW = pageW - MARGIN - MARGIN_R;
    const chartH = chartW * 0.38;
    y = ensureSpace(doc, y, chartH + 10);
    doc.addImage(chartImg, 'PNG', MARGIN, y, chartW, chartH);
    y += chartH + 3;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gray400);
    doc.text('Gambar 1 — Distribusi jumlah soal evaluasi pada masing-masing modul pembelajaran.', MARGIN, y);
    y += 7;
  }

  // ── Section 3: Tabel Data Modul
  y = drawSectionTitle(doc, y, '3', 'Tabel Data Modul');

  const tableData = modules.map((m, i) => [
    i + 1,
    m.judul,
    m.kategori || 'Umum',
    m.deskripsi || '-',
    (parseInt(m.jumlah_soal) || 0) + ' soal',
    m.created_at ? new Date(m.created_at).toLocaleDateString('id-ID') : '-',
  ]);

  autoTable(doc, {
    startY: y,
    head: [['No', 'Nama Modul', 'Kategori', 'Deskripsi', 'Jml. Soal', 'Tanggal Dibuat']],
    body: tableData,
    ...TABLE_THEME,
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 40 },
      2: { cellWidth: 28 },
      4: { halign: 'center', cellWidth: 18 },
      5: { halign: 'center', cellWidth: 24 },
    },
  });

  // Summary row
  let finalY = doc.lastAutoTable.finalY + 2;
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFillColor(...C.primary);
  doc.roundedRect(MARGIN, finalY, pageW - MARGIN - MARGIN_R, 9, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.white);
  doc.text(
    `TOTAL:   ${totalModul} Modul    |    ${totalSoal} Butir Soal    |    ${categories.length} Kategori`,
    MARGIN + 5, finalY + 6
  );
  finalY += 14;

  // Signature
  drawSignatureBlock(doc, finalY);

  drawWatermark(doc);
  drawFooter(doc);
  doc.save(`Data_Modul_SiIklimMuda_${docNumber.replace(/\//g, '-')}.pdf`);
}
