import { useState, useEffect } from 'react';
import { GraduationCap, Battery, Wifi, Signal, ScanLine, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

function ScanBarcodePage() {
  const navigate = useNavigate();
  const [scanSuccess, setScanSuccess] = useState(false);
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
    setScanSuccess(true);
    setTimeout(() => {
      navigate('/siswa/data-pengguna');
    }, 1000);
  };

  return (
    <div className="mobile-app-container">
      <div className="mobile-screen">
        {/* Status Bar */}
        <div className="status-bar">
          <span className="time">{currentTime}</span>
          <div className="status-icons">
            <Signal size={13} />
            <Wifi size={13} />
            <Battery size={15} />
          </div>
        </div>

        {/* Header */}
        <header className="mobile-header">
          <div className="app-title">
            <div className="app-logo-bg">
              <GraduationCap size={16} color="#1d4ed8" />
            </div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="badge-portal">
            <div className="dot"></div>
            Portal Siswa
          </div>
        </header>

        {/* Content */}
        <div className="form-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>

          {/* Hero Section */}
          <div style={{ textAlign: 'center', paddingTop: 24 }}>
            <div style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              borderRadius: 20, margin: '0 auto 12px',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              boxShadow: '0 4px 14px rgba(59,130,246,0.2)'
            }}>
              <ScanLine size={32} color="#1d4ed8" />
            </div>
            <h1 className="page-title" style={{ textAlign: 'center', marginBottom: 6 }}>Scan Barcode</h1>
            <p className="page-subtitle" style={{ textAlign: 'center' }}>Arahkan kamera ke barcode untuk memulai asesmen iklim</p>
          </div>

          {/* Scanner Frame */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 240, height: 240,
              backgroundColor: scanSuccess ? '#f0fdf4' : '#ffffff',
              borderRadius: 24, marginBottom: 16,
              position: 'relative',
              boxShadow: scanSuccess
                ? '0 0 0 3px #10b981, 0 8px 30px rgba(16,185,129,0.2)'
                : '0 8px 30px rgba(0,0,0,0.08)',
              transition: 'all 0.4s ease',
            }}>
              {/* Corner brackets */}
              {[['top', 'left', '8px 0 0 8px'], ['top', 'right', '0 8px 8px 0'], ['bottom', 'left', '0 0 8px 8px'], ['bottom', 'right', '0 8px 8px 0']].map(([v, h, r], i) => (
                <div key={i} style={{
                  position: 'absolute', [v]: 18, [h]: 18,
                  width: 28, height: 28,
                  borderTop: v === 'top' ? '3px solid #1e3a8a' : 'none',
                  borderBottom: v === 'bottom' ? '3px solid #1e3a8a' : 'none',
                  borderLeft: h === 'left' ? '3px solid #1e3a8a' : 'none',
                  borderRight: h === 'right' ? '3px solid #1e3a8a' : 'none',
                  borderRadius: r,
                }} />
              ))}

              {/* Scan line animation */}
              {!scanSuccess && (
                <div style={{
                  position: 'absolute', left: '14%', right: '14%', top: '50%',
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
                  boxShadow: '0 0 8px #10b981',
                  animation: 'scan 2s ease-in-out infinite',
                }} />
              )}

              {/* Success icon */}
              {scanSuccess && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CheckCircle size={56} color="#10b981" />
                </div>
              )}

              {/* Center icon when idle */}
              {!scanSuccess && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                  <ScanLine size={28} color="#cbd5e1" />
                </div>
              )}

              <style>{`
                @keyframes scan {
                  0%   { transform: translateY(-70px); opacity: 0.6; }
                  50%  { transform: translateY(70px);  opacity: 1; }
                  100% { transform: translateY(-70px); opacity: 0.6; }
                }
              `}</style>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', letterSpacing: 0.5, fontWeight: 600, textTransform: 'uppercase' }}>
              {scanSuccess ? '✓ Barcode Berhasil Dipindai' : 'Arahkan ke Barcode'}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="submit-section" style={{ marginBottom: 8 }}>
            <button className="submit-btn" onClick={handleScan} disabled={scanSuccess}>
              <ScanLine size={18} />
              {scanSuccess ? 'Memuat...' : 'Scan Barcode'}
            </button>
            <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
              Pastikan barcode terlihat jelas dan berada di dalam bingkai kamera.
            </p>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>
      </div>
    </div>
  );
}

export default ScanBarcodePage;
