import { useState, useEffect, useRef } from 'react';
import { ScanLine, Camera, AlertTriangle, CheckCircle2, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './mobile-green-theme.css';
import './ScanBarcodePage.css';

function ScanBarcodePage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'fail' | null
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  const handleScan = () => {
    setScanning(true);
    setResult(null);
    // Simulate scan: 70% success
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      setResult(isSuccess ? 'success' : 'fail');
      setScanning(false);
      if (isSuccess) {
        setTimeout(() => navigate('/siswa/verifikasi-id'), 800);
      }
    }, 2200);
  };

  return (
    <div className="m-app">
      <div className="m-screen">
        <div className="m-statusbar">
          <span>{currentTime}</span>
          <div className="m-statusbar-icons">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="10" x2="23" y2="14"/></svg>
          </div>
        </div>

        {/* Header */}
        <header className="m-header" style={{ borderBottom: 'none', background: 'transparent' }}>
          <div className="m-app-title">
            <div className="m-app-logo"><Leaf size={16} color="#059669" /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="m-badge"><div className="m-badge-dot"></div> Portal Siswa</div>
        </header>

        {/* Body */}
        <div className="m-body scan-body">
          <div className="scan-hero-text">
            <h1 className="m-title" style={{ textAlign: 'center', fontSize: 22 }}>Scan QR Code</h1>
            <p className="m-subtitle" style={{ textAlign: 'center', marginBottom: 24 }}>
              Arahkan kamera ke QR Code yang tersedia untuk memulai sesi pembelajaran.
            </p>
          </div>

          {/* Camera Viewfinder */}
          <div className="scan-viewfinder">
            <div className="scan-camera-bg">
              <Camera size={48} strokeWidth={1.5} className="scan-camera-icon" />
              <span className="scan-camera-text">Area Kamera</span>
            </div>
            {/* Corner Brackets */}
            <div className="scan-corner tl"></div>
            <div className="scan-corner tr"></div>
            <div className="scan-corner bl"></div>
            <div className="scan-corner br"></div>
            {/* Animated Scan Line */}
            {scanning && <div className="scan-line-anim"></div>}
          </div>

          {/* Status */}
          {result === 'fail' && (
            <div className="scan-alert fail">
              <AlertTriangle size={18} />
              <div>
                <strong>Barcode Tidak Valid</strong>
                <p>QR Code tidak dikenali. Coba scan ulang.</p>
              </div>
            </div>
          )}
          {result === 'success' && (
            <div className="scan-alert success">
              <CheckCircle2 size={18} />
              <div>
                <strong>Scan Berhasil!</strong>
                <p>Mengarahkan ke halaman verifikasi...</p>
              </div>
            </div>
          )}

          {/* Scan Button */}
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <button
              className="m-btn-primary"
              onClick={handleScan}
              disabled={scanning}
              style={scanning ? { opacity: 0.7 } : {}}
            >
              {scanning ? (
                <>
                  <div className="scan-spinner"></div>
                  Memindai...
                </>
              ) : (
                <>
                  <ScanLine size={18} />
                  Mulai Scan
                </>
              )}
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 12 }}>
              Pastikan QR Code terlihat jelas dan berada dalam bingkai kamera.
            </p>
          </div>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default ScanBarcodePage;
