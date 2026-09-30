import { useState, useEffect } from 'react';
import { ChevronLeft, Leaf, Phone, ArrowRight, ShieldCheck, Info, UserCheck, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './mobile-green-theme.css';

/**
 * VerifikasiIDPage — Session Recovery System
 * 1 Nomor Telepon = 1 Data User (Primary Key)
 * - Nomor BARU → arahkan ke Form Biodata
 * - Nomor SUDAH ADA → langsung ke Dashboard (recovery sesi)
 */
function VerifikasiIDPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // Retrieve all registered users from localStorage
  const getRegisteredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    } catch { return {}; }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setChecking(true);

    // Simulate a brief check delay
    setTimeout(() => {
      const users = getRegisteredUsers();
      const existingUser = users[phone];

      if (existingUser) {
        // Auto resume session and navigate to dashboard
        localStorage.setItem('siswaPhone', phone);
        localStorage.setItem('currentStudent', JSON.stringify(existingUser));
        
        // Restore progress flags
        if (existingUser.pretestDone) localStorage.setItem('pretestDone', 'true');
        if (existingUser.modulDone) localStorage.setItem('modulDone', 'true');
        if (existingUser.skorPretest) localStorage.setItem('skorPretest', existingUser.skorPretest);
        if (existingUser.skorPosttest) localStorage.setItem('skorPosttest', existingUser.skorPosttest);
        if (existingUser.posttestTime) localStorage.setItem('posttestTime', existingUser.posttestTime);

        setChecking(false);
        navigate('/siswa/dashboard');
      } else {
        // New user — proceed to biodata
        localStorage.setItem('siswaPhone', phone);
        setChecking(false);
        navigate('/siswa/biodata');
      }
    }, 800);
  };

  const isValid = phone.length >= 10;

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
          <div className="m-badge"><div className="m-badge-dot"></div> Portal Siswa</div>
        </header>

        <div className="m-progress">
          <div className="m-progress-text">
            <span className="m-progress-step">Langkah 1 dari 4</span>
            <span className="m-progress-label">Verifikasi ID</span>
          </div>
          <div className="m-progress-bars">
            <div className="m-progress-bar active"></div>
            <div className="m-progress-bar"></div>
            <div className="m-progress-bar"></div>
            <div className="m-progress-bar"></div>
          </div>
        </div>

        <div className="m-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div className="m-icon-circle green"><ShieldCheck size={20} /></div>
            <h1 className="m-title" style={{ fontSize: 22 }}>Verifikasi ID</h1>
          </div>
          <p className="m-subtitle">Masukkan nomor telepon Anda sebagai ID siswa untuk verifikasi identitas.</p>

          <form onSubmit={handleSubmit}>
            <div className="m-form-group">
              <label className="m-label">Nomor Telepon (ID Siswa) <span className="req">*</span></label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  className="m-input"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  style={{ paddingLeft: 40 }}
                  required
                  maxLength={13}
                />
              </div>
              {phone.length > 0 && phone.length < 10 && (
                <p style={{ fontSize: 11, color: '#EF4444', marginTop: 6, fontWeight: 500 }}>Minimal 10 digit nomor telepon.</p>
              )}
            </div>

            <div className="m-info-box">
              <Info size={16} className="m-info-icon" />
              <p>Nomor ini menjadi ID unik Anda. Jika Anda sudah pernah mendaftar, Anda akan otomatis masuk ke Dashboard.</p>
            </div>

            <div style={{ marginTop: 32 }}>
              <button type="submit" className="m-btn-primary" disabled={!isValid || checking}>
                {checking ? (
                  <><div className="scan-spinner"></div> Memeriksa...</>
                ) : (
                  <>Lanjut<ArrowRight size={17} /></>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default VerifikasiIDPage;
