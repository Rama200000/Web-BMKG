import { useState, useEffect } from 'react';
import { Menu, Bell, QrCode, Download, Printer, Copy, CheckCircle2, ExternalLink, Smartphone } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './QRCodePage.css';

function QRCodePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Auto-detect base URL
    const url = window.location.origin;
    setBaseUrl(url);
  }, []);

  const studentUrl = `${baseUrl}/siswa/scan`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(studentUrl)}&color=059669&bgcolor=ffffff&margin=20`;

  const handleCopy = () => {
    navigator.clipboard.writeText(studentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrApiUrl;
    link.download = 'QRCode-SiIklimMuda.png';
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - Si Iklim Muda BMKG</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
          .print-card { text-align: center; padding: 48px 40px; border: 3px solid #059669; border-radius: 24px; max-width: 420px; }
          .print-logo { font-size: 28px; font-weight: 800; color: #059669; margin-bottom: 4px; }
          .print-sub { font-size: 14px; color: #6B7280; margin-bottom: 24px; }
          .print-qr { margin: 0 auto 20px; }
          .print-qr img { width: 280px; height: 280px; border-radius: 12px; }
          .print-instructions { font-size: 13px; color: #374151; line-height: 1.6; margin-bottom: 16px; }
          .print-url { font-size: 11px; color: #9CA3AF; word-break: break-all; padding: 10px 16px; background: #F3F4F6; border-radius: 8px; }
          .print-footer { margin-top: 20px; font-size: 11px; color: #9CA3AF; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .print-card { border-color: #059669 !important; } }
        </style>
      </head>
      <body>
        <div class="print-card">
          <div class="print-logo">🌿 Si Iklim Muda</div>
          <div class="print-sub">BMKG — Portal Siswa</div>
          <div class="print-qr"><img src="${qrApiUrl}" alt="QR Code" /></div>
          <div class="print-instructions">
            <strong>Cara Menggunakan:</strong><br/>
            1. Buka kamera HP atau Google Lens<br/>
            2. Arahkan ke QR Code di atas<br/>
            3. Tap link yang muncul untuk masuk
          </div>
          <div class="print-url">${studentUrl}</div>
          <div class="print-footer">© ${new Date().getFullYear()} BMKG — Si Iklim Muda</div>
        </div>
        <script>setTimeout(() => { window.print(); }, 500);</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button className="topbar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}><Menu /></button>
          </div>
          <div className="topbar-right">
            <button className="topbar-notification"><Bell /><span className="notification-badge"></span></button>
            <div className="topbar-profile">
              <div className="profile-avatar">A</div>
              <div className="profile-info">
                <span className="profile-name">Admin</span>
                <span className="profile-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <h1 className="dashboard-title">QR Code Portal Siswa</h1>
          <p className="dashboard-subtitle">Generate, cetak, atau bagikan QR Code untuk siswa mengakses portal pembelajaran.</p>

          <div className="qr-page-grid">
            {/* QR Code Preview */}
            <div className="qr-preview-card">
              <div className="qr-preview-header">
                <QrCode size={20} />
                <h3>Preview QR Code</h3>
              </div>
              <div className="qr-preview-body">
                <div className="qr-image-wrap">
                  <img
                    src={qrApiUrl}
                    alt="QR Code Si Iklim Muda"
                    className="qr-image"
                    crossOrigin="anonymous"
                  />
                </div>
                <p className="qr-brand">🌿 Si Iklim Muda — BMKG</p>
                <p className="qr-hint">Scan dengan kamera HP atau Google Lens</p>
              </div>
              <div className="qr-preview-actions">
                <button className="qr-action-btn primary" onClick={handleDownload}>
                  <Download size={16} /> Download PNG
                </button>
                <button className="qr-action-btn outline" onClick={handlePrint}>
                  <Printer size={16} /> Cetak
                </button>
              </div>
            </div>

            {/* Info Panel */}
            <div className="qr-info-panel">
              {/* URL Card */}
              <div className="qr-info-card">
                <h4><ExternalLink size={16} /> Link Portal Siswa</h4>
                <div className="qr-url-box">
                  <code>{studentUrl}</code>
                  <button className="qr-copy-btn" onClick={handleCopy}>
                    {copied ? <><CheckCircle2 size={14} /> Tersalin!</> : <><Copy size={14} /> Salin</>}
                  </button>
                </div>
                <p className="qr-info-note">QR Code di samping mengarahkan ke link ini.</p>
              </div>

              {/* Instructions Card */}
              <div className="qr-info-card">
                <h4><Smartphone size={16} /> Cara Penggunaan</h4>
                <div className="qr-steps">
                  <div className="qr-step">
                    <div className="qr-step-num">1</div>
                    <div>
                      <strong>Cetak QR Code</strong>
                      <p>Download atau cetak QR Code, lalu tempel di lokasi kegiatan.</p>
                    </div>
                  </div>
                  <div className="qr-step">
                    <div className="qr-step-num">2</div>
                    <div>
                      <strong>Siswa Scan</strong>
                      <p>Siswa membuka kamera HP atau Google Lens, lalu mengarahkan ke QR Code.</p>
                    </div>
                  </div>
                  <div className="qr-step">
                    <div className="qr-step-num">3</div>
                    <div>
                      <strong>Mulai Belajar</strong>
                      <p>Siswa akan masuk ke portal, mengisi data, dan memulai Pretest → Modul → Posttest.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="qr-info-card tip">
                <h4>💡 Tips</h4>
                <ul>
                  <li>Untuk deployment online, ganti URL ke domain Vercel/hosting Anda.</li>
                  <li>QR Code bisa digunakan berulang — setiap siswa baru akan mengisi data sendiri.</li>
                  <li>Pastikan koneksi internet tersedia di lokasi kegiatan.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodePage;
