import { useState } from 'react';
import {
  Menu,
  Bell,
  Users,
  BookOpen,
  FileQuestion,
  ClipboardList,
  ChevronDown,
  Download,
  School,
  BarChart2,
  ArrowLeft,
  Home,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Table2,
  Network,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Sidebar from '../../components/Sidebar';
import './DashboardPage.css';

// Data sekolah
const sekolahList = [
  { nama: 'SMAN 1 Bandar Lampung', jumlahSiswa: 28 },
  { nama: 'SMKN 2 Bandar Lampung', jumlahSiswa: 22 },
  { nama: 'SMAN 3 Bandar Lampung', jumlahSiswa: 35 },
  { nama: 'SMA Al-Kautsar',        jumlahSiswa: 18 },
];

const chartDataPerSekolah = {
  'SMAN 1 Bandar Lampung': [
    { skor: '60', pretest: 1, posttest: 0 },
    { skor: '70', pretest: 2, posttest: 1 },
    { skor: '75', pretest: 3, posttest: 2 },
    { skor: '80', pretest: 5, posttest: 5 },
    { skor: '85', pretest: 7, posttest: 9 },
    { skor: '90', pretest: 5, posttest: 7 },
    { skor: '95', pretest: 3, posttest: 3 },
    { skor: '100', pretest: 2, posttest: 1 },
  ],
  'SMKN 2 Bandar Lampung': [
    { skor: '60', pretest: 2, posttest: 0 },
    { skor: '70', pretest: 4, posttest: 2 },
    { skor: '75', pretest: 3, posttest: 3 },
    { skor: '80', pretest: 6, posttest: 7 },
    { skor: '85', pretest: 4, posttest: 6 },
    { skor: '90', pretest: 2, posttest: 3 },
    { skor: '95', pretest: 1, posttest: 1 },
    { skor: '100', pretest: 0, posttest: 0 },
  ],
  'SMAN 3 Bandar Lampung': [
    { skor: '60', pretest: 0, posttest: 0 },
    { skor: '70', pretest: 3, posttest: 1 },
    { skor: '75', pretest: 5, posttest: 3 },
    { skor: '80', pretest: 8, posttest: 9 },
    { skor: '85', pretest: 9, posttest: 12 },
    { skor: '90', pretest: 6, posttest: 7 },
    { skor: '95', pretest: 3, posttest: 2 },
    { skor: '100', pretest: 1, posttest: 1 },
  ],
  'SMA Al-Kautsar': [
    { skor: '60', pretest: 1, posttest: 0 },
    { skor: '70', pretest: 2, posttest: 0 },
    { skor: '75', pretest: 2, posttest: 2 },
    { skor: '80', pretest: 4, posttest: 5 },
    { skor: '85', pretest: 5, posttest: 6 },
    { skor: '90', pretest: 3, posttest: 4 },
    { skor: '95', pretest: 1, posttest: 1 },
    { skor: '100', pretest: 0, posttest: 0 },
  ],
};

const formatDokumen = [
  {
    id: 'xlsx',
    icon: FileSpreadsheet,
    label: 'Excel (.xlsx)',
    desc: 'Data lengkap siswa, rekap nilai & peringkat',
    iconColor: '#16a34a',
    iconBg: '#f0fdf4',
  },
  {
    id: 'pdf',
    icon: FileText,
    label: 'PDF (.pdf)',
    desc: 'Format cetak resmi berstandar kop BMKG',
    iconColor: '#dc2626',
    iconBg: '#fef2f2',
  },
  {
    id: 'csv',
    icon: Table2,
    label: 'CSV (.csv)',
    desc: 'Data mentah untuk pengolahan SPSS/R',
    iconColor: '#6b7280',
    iconBg: '#f3f4f6',
  },
];

// Custom tooltip
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bar-tooltip">
        <p className="bar-tooltip-label">Skor: <strong>{label}</strong></p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.fill }}>
            {entry.name}: <strong>{entry.value} siswa</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomBarLabel = ({ x, y, width, value }) => {
  if (!value) return null;
  return (
    <text x={x + width / 2} y={y - 4} fill="#64748b" textAnchor="middle" fontSize={11} fontWeight={600}>
      {value}
    </text>
  );
};

function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sekolahTerpilih, setSekolahTerpilih]   = useState('SMAN 1 Bandar Lampung');
  const [dropdownOpen, setDropdownOpen]         = useState(false);
  const [showEkspor, setShowEkspor]             = useState(false);

  // State ekspor
  const [cakupan, setCakupan]   = useState('per-sekolah'); // 'per-sekolah' | 'semua'
  const [format, setFormat]     = useState('xlsx');

  const sekolahInfo = sekolahList.find(s => s.nama === sekolahTerpilih);
  const chartData   = chartDataPerSekolah[sekolahTerpilih];
  const totalSiswa  = sekolahList.reduce((a, s) => a + s.jumlahSiswa, 0);

  const handlePilihSekolah = (nama) => {
    setSekolahTerpilih(nama);
    setDropdownOpen(false);
  };

  const formatLabel = formatDokumen.find(f => f.id === format)?.label || '';
  const unduhLabel  = cakupan === 'per-sekolah'
    ? `Unduh Laporan ${sekolahInfo?.nama?.split(' ').slice(0, 2).join(' ')} (.${format})`
    : `Unduh Laporan Semua Sekolah (.${format})`;

  const handleDownload = () => {
    let dataToExport = [];
    let title = '';

    if (cakupan === 'per-sekolah') {
      title = `Laporan_Evaluasi_${sekolahTerpilih.replace(/\s+/g, '_')}`;
      const dataSekolah = chartDataPerSekolah[sekolahTerpilih];
      dataToExport = dataSekolah.map(d => ({
        'Skor (0-100)': d.skor,
        'Frekuensi Pre-Test': d.pretest,
        'Frekuensi Post-Test': d.posttest
      }));
    } else {
      title = 'Laporan_Evaluasi_Semua_Sekolah';
      Object.keys(chartDataPerSekolah).forEach(sekolah => {
        chartDataPerSekolah[sekolah].forEach(d => {
          dataToExport.push({
            'Sekolah': sekolah,
            'Skor (0-100)': d.skor,
            'Frekuensi Pre-Test': d.pretest,
            'Frekuensi Post-Test': d.posttest
          });
        });
      });
    }

    if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
      XLSX.writeFile(workbook, `${title}.xlsx`);
    } else if (format === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${title}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text(cakupan === 'per-sekolah' ? `Laporan Evaluasi - ${sekolahTerpilih}` : 'Laporan Evaluasi - Semua Sekolah', 14, 15);
      
      const tableColumn = Object.keys(dataToExport[0]);
      const tableRows = [];

      dataToExport.forEach(item => {
        const rowData = [];
        tableColumn.forEach(col => {
          rowData.push(item[col]);
        });
        tableRows.push(rowData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });

      doc.save(`${title}.pdf`);
    }
  };

  // ──────────────────────────────────────────────
  // VIEW: EKSPOR LAPORAN
  // ──────────────────────────────────────────────
  const EksporView = () => (
    <div className="dashboard-content">
      {/* Sub-breadcrumb + Kembali */}
      <div className="ekspor-subbread">
        <div className="ekspor-bread-left">
          <Home size={14} />
          <span>Beranda</span>
          <ChevronRight size={13} />
          <span className="bread-active">Ekspor Laporan</span>
        </div>
        <button className="btn-kembali-grafik" onClick={() => setShowEkspor(false)}>
          <ArrowLeft size={14} />
          Kembali ke Grafik
        </button>
      </div>

      {/* Card Ekspor */}
      <div className="ekspor-card">
        {/* Header */}
        <div className="ekspor-card-header">
          <div className="ekspor-icon-wrap">
            <Download size={22} />
          </div>
          <div>
            <h2 className="ekspor-card-title">Ekspor Laporan Evaluasi</h2>
            <p className="ekspor-card-sub">
              {sekolahTerpilih} &bull; {sekolahInfo?.jumlahSiswa} Siswa Tervalidasi
            </p>
          </div>
        </div>

        <div className="ekspor-divider" />

        {/* Pilih Cakupan Data */}
        <div className="ekspor-section">
          <div className="ekspor-section-header">
            <span className="ekspor-section-title">PILIH CAKUPAN DATA</span>
            <span className="ekspor-section-hint">Pilih target pelaporan</span>
          </div>

          <div className="cakupan-options">
            {/* Per Sekolah */}
            <label
              className={`cakupan-option ${cakupan === 'per-sekolah' ? 'selected' : ''}`}
              onClick={() => setCakupan('per-sekolah')}
            >
              <div className="cakupan-option-top">
                <div className="cakupan-label-row">
                  <School size={14} color="#1E40AF" />
                  <span className="cakupan-type">PER SEKOLAH</span>
                </div>
                <input
                  type="radio"
                  name="cakupan"
                  checked={cakupan === 'per-sekolah'}
                  onChange={() => setCakupan('per-sekolah')}
                  className="cakupan-radio"
                />
              </div>
              <div className="cakupan-name-row">
                <span className="cakupan-school-name">{sekolahTerpilih}</span>
                <span className="cakupan-badge-count">{sekolahInfo?.jumlahSiswa} Siswa</span>
              </div>
              <p className="cakupan-desc">Data spesifik kelas & peringkat siswa {sekolahInfo?.nama?.split(' ').slice(0,2).join(' ')}</p>
            </label>

            {/* Semua Sekolah */}
            <label
              className={`cakupan-option ${cakupan === 'semua' ? 'selected' : ''}`}
              onClick={() => setCakupan('semua')}
            >
              <div className="cakupan-option-top">
                <div className="cakupan-label-row">
                  <Network size={14} color="#475569" />
                  <span className="cakupan-type">SEMUA SEKOLAH</span>
                </div>
                <input
                  type="radio"
                  name="cakupan"
                  checked={cakupan === 'semua'}
                  onChange={() => setCakupan('semua')}
                  className="cakupan-radio"
                />
              </div>
              <div className="cakupan-name-row">
                <span className="cakupan-badge-multi">{sekolahList.length} Sekolah &bull; {totalSiswa} Siswa</span>
              </div>
              <p className="cakupan-desc">Rekapitulasi gabungan seluruh sekolah mitra binaan</p>
            </label>
          </div>
        </div>

        <div className="ekspor-divider" />

        {/* Pilih Format Dokumen */}
        <div className="ekspor-section">
          <div className="ekspor-section-header">
            <span className="ekspor-section-title">PILIH FORMAT DOKUMEN</span>
          </div>

          <div className="format-options">
            {formatDokumen.map(f => {
              const Icon = f.icon;
              return (
                <label
                  key={f.id}
                  className={`format-option ${format === f.id ? 'selected' : ''}`}
                  onClick={() => setFormat(f.id)}
                >
                  <div className="format-option-top">
                    <div className="format-icon-wrap" style={{ background: f.iconBg }}>
                      <Icon size={22} color={f.iconColor} />
                    </div>
                    <input
                      type="radio"
                      name="format"
                      checked={format === f.id}
                      onChange={() => setFormat(f.id)}
                      className="cakupan-radio"
                    />
                  </div>
                  <p className="format-label">{f.label}</p>
                  <p className="format-desc">{f.desc}</p>
                </label>
              );
            })}
          </div>
        </div>

        <div className="ekspor-divider" />

        {/* Footer Aksi */}
        <div className="ekspor-footer">
          <button className="btn-batal" onClick={() => setShowEkspor(false)}>
            Batal / Kembali
          </button>
          <button className="btn-unduh" id="btn-unduh-laporan" onClick={handleDownload}>
            <Download size={15} />
            {unduhLabel}
          </button>
        </div>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────
  // VIEW: DASHBOARD UTAMA
  // ──────────────────────────────────────────────
  const DashboardView = () => (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">
        Selamat datang di halaman admin. Berikut adalah ringkasan data sistem.
      </p>

      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon blue"><Users /></div>
          <div className="stat-info">
            <span className="stat-label">Total Siswa</span>
            <span className="stat-value">120</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal"><BookOpen /></div>
          <div className="stat-info">
            <span className="stat-label">Total Modul</span>
            <span className="stat-value">8</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon indigo"><FileQuestion /></div>
          <div className="stat-info">
            <span className="stat-label">Total Soal</span>
            <span className="stat-value">320</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon navy"><ClipboardList /></div>
          <div className="stat-info">
            <span className="stat-label">Total Pengerjaan</span>
            <span className="stat-value">98</span>
          </div>
        </div>
      </div>

      {/* Analisis Performa Sekolah */}
      <div className="analysis-card">
        <div className="analysis-header">
          <div className="analysis-header-left">
            <div className="analysis-title-row">
              <BarChart2 size={20} className="analysis-icon" />
              <h3 className="analysis-title">Analisis Performa Sekolah</h3>
            </div>
            <div className="analysis-tags">
              <span className="tag tag-school">
                <span className="tag-dot"></span>
                {sekolahTerpilih}
              </span>
              <span className="tag tag-count">{sekolahInfo?.jumlahSiswa} Siswa</span>
            </div>
            <p className="analysis-desc">
              Distribusi skor 25 soal evaluasi pemahaman iklim khusus siswa terdaftar {sekolahTerpilih}
            </p>
          </div>

          <div className="analysis-header-right">
            {/* Dropdown Pilih Sekolah */}
            <div className="sekolah-dropdown-wrapper">
              <button
                className="sekolah-dropdown-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                id="btn-pilih-sekolah"
              >
                <School size={14} />
                <span>Pilih Sekolah: <strong>{sekolahTerpilih} (Terpilih)</strong></span>
                <ChevronDown size={14} className={dropdownOpen ? 'rotate-180' : ''} />
              </button>
              {dropdownOpen && (
                <div className="sekolah-dropdown-menu">
                  {sekolahList.map((s) => (
                    <button
                      key={s.nama}
                      className={`sekolah-dropdown-item ${s.nama === sekolahTerpilih ? 'active' : ''}`}
                      onClick={() => handlePilihSekolah(s.nama)}
                    >
                      {s.nama}
                      <span className="item-count">{s.jumlahSiswa} siswa</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tombol Ekspor */}
            <button
              className="btn-ekspor"
              id="btn-ekspor"
              onClick={() => { setShowEkspor(true); setDropdownOpen(false); }}
            >
              <Download size={14} />
              Ekspor
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-area">
          <div className="chart-top-bar">
            <div className="chart-top-title">
              <BarChart2 size={15} color="#64748b" />
              <span>Distribusi Frekuensi Skor Perolehan Pre-Test vs Post-Test</span>
            </div>
            <div className="chart-legend-row">
              <div className="chart-legend-item">
                <span className="legend-box blue-box"></span>
                <span>Pre-Test (Biru Royal)</span>
              </div>
              <div className="chart-legend-item">
                <span className="legend-box green-box"></span>
                <span>Post-Test (Hijau Emerald)</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="skor" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 'dataMax + 1']} allowDecimals={false} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="pretest"  name="Pre-Test"  fill="#1E40AF" radius={[4,4,0,0]} maxBarSize={32} label={<CustomBarLabel />} />
              <Bar dataKey="posttest" name="Post-Test" fill="#059669" radius={[4,4,0,0]} maxBarSize={32} label={<CustomBarLabel />} />
            </BarChart>
          </ResponsiveContainer>

          <div className="chart-axis-labels">
            <span>Sumbu Y: Frekuensi (Jumlah Siswa {sekolahTerpilih})</span>
            <span>Sumbu X: Nilai Skor Akhir Evaluasi (Skala 0 – 100)</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="dashboard-main">
        {/* Top Bar */}
        <header className="dashboard-topbar" id="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="topbar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              id="sidebar-toggle"
            >
              <Menu />
            </button>
            <div className="topbar-breadcrumb">
              <span className="breadcrumb-root">Si Iklim Muda</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">Dashboard</span>
            </div>
          </div>
          <div className="topbar-right">
            <button className="topbar-notification" id="notification-btn">
              <Bell />
              <span className="notification-badge"></span>
            </button>
            <div className="topbar-profile" id="profile-btn">
              <div className="profile-avatar">A</div>
              <div className="profile-info">
                <span className="profile-name">Admin</span>
                <span className="profile-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Render view berdasarkan state */}
        {showEkspor ? <EksporView /> : <DashboardView />}
      </div>
    </div>
  );
}

export default DashboardPage;
