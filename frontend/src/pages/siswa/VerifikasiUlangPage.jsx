import { useState, useEffect } from 'react';
import { ChevronLeft, Leaf, ShieldCheck, Phone, ScanLine, Camera, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './mobile-green-theme.css';
import './VerifikasiUlangPage.css';

function VerifikasiUlangPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = phone, 2 = scan
  const [phone, setPhone] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [error, setError] = useState('');

  const savedPhone = localStorage.getItem('siswaPhone') || '';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone === savedPhone || savedPhone === '') {
      setError('');
      setStep(2);
    } else {
      setError('Nomor telepon tidak cocok dengan data sebelumnya.');
    }
  };

  const handleScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      const success = Math.random() > 0.2;
      setScanResult(success ? 'success' : 'fail');
      setScanning(false);
      if (success) {
        setTimeout(() => navigate('/siswa/ujian?mode=posttest'), 800);
      }
    }, 2000);
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

        <header className="m-header">
          <button className="m-back-btn" onClick={() => navigate(-1)}><ChevronLeft size={18} /></button>
          <div className="m-app-title">
            <div className="m-app-logo"><Leaf size={16} color="#059669" /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="m-badge"><div className="m-badge-dot"></div> Verifikasi</div>
        </header>

        <div className="m-body verif-body">
          {/* Step indicator */}
          <div className="verif-steps">
            <div className={`verif-step-item ${step >= 1 ? 'active' : ''}`}>
              <div className="verif-step-num">{step > 1 ? <CheckCircle2 size={16} /> : '1'}</div>
              <span>ID Siswa</span>
            </div>
            <div className="verif-step-line"></div>
            <div className={`verif-step-item ${step >= 2 ? 'active' : ''}`}>
              <div className="verif-step-num">2</div>
              <span>Scan QR</span>
            </div>
          </div>

          {step === 1 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, marginTop: 16 }}>
                <div className="m-icon-circle green"><ShieldCheck size={20} /></div>
                <h1 className="m-title" style={{ fontSize: 20 }}>Verifikasi Ulang</h1>
              </div>
              <p className="m-subtitle">Untuk keamanan, masukkan kembali nomor telepon Anda sebelum memulai Posttest.</p>

              <form onSubmit={handlePhoneSubmit}>
                <div className="m-form-group">
                  <label className="m-label">Nomor Telepon <span className="req">*</span></label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input
                      className="m-input"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                      style={{ paddingLeft: 40 }}
                      required
                      maxLength={13}
                    />
                  </div>
                  {error && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 6, fontWeight: 500 }}>{error}</p>}
                </div>

                <div style={{ marginTop: 24 }}>
                  <button type="submit" className="m-btn-primary" disabled={phone.length < 10}>
                    Verifikasi & Lanjut
                    <ArrowRight size={17} />
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <div className="m-icon-circle green" style={{ margin: '0 auto 12px', width: 48, height: 48 }}>
                  <ScanLine size={24} />
                </div>
                <h1 className="m-title" style={{ fontSize: 20, textAlign: 'center' }}>Scan QR Code</h1>
                <p className="m-subtitle" style={{ textAlign: 'center' }}>Langkah terakhir — scan QR Code untuk memulai Posttest.</p>
              </div>

              {/* Mini viewfinder */}
              <div className="verif-scan-viewfinder">
                <div className="verif-scan-bg">
                  <Camera size={36} strokeWidth={1.5} style={{ color: '#4B5563' }} />
                </div>
                <div className="scan-corner tl"></div>
                <div className="scan-corner tr"></div>
                <div className="scan-corner bl"></div>
                <div className="scan-corner br"></div>
                {scanning && <div className="scan-line-anim"></div>}
              </div>

              {scanResult === 'fail' && (
                <div className="scan-alert fail" style={{ maxWidth: '100%' }}>
                  <AlertTriangle size={18} />
                  <div><strong>Gagal</strong><p>QR tidak valid. Coba lagi.</p></div>
                </div>
              )}
              {scanResult === 'success' && (
                <div className="scan-alert success" style={{ maxWidth: '100%' }}>
                  <CheckCircle2 size={18} />
                  <div><strong>Berhasil!</strong><p>Membuka Posttest...</p></div>
                </div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                <button className="m-btn-primary" onClick={handleScan} disabled={scanning}>
                  {scanning ? (
                    <><div className="scan-spinner"></div> Memindai...</>
                  ) : (
                    <><ScanLine size={18} /> Scan Sekarang</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default VerifikasiUlangPage;
