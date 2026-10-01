import { useState, useEffect } from 'react';
import { ChevronLeft, Phone, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './VerifikasiIDPage.css';

/**
 * VerifikasiIDPage — Session Recovery System
 * 1 Nomor Telepon = 1 Data User (Primary Key)
 * - Nomor BARU → arahkan ke Form Biodata
 * - Nomor SUDAH ADA → langsung ke Dashboard (recovery sesi)
 * Mode `?untuk=posttest` (setelah scan dari kartu Posttest): nomor harus sama dengan
 * nomor siswa yang sedang masuk, lalu lanjut ke informasi waktu posttest.
 */
function VerifikasiIDPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const untukPosttest = searchParams.get('untuk') === 'posttest';
  const [phone, setPhone] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [checking, setChecking] = useState(false);
  const [mismatch, setMismatch] = useState(false);

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
      if (untukPosttest) {
        setChecking(false);
        if (phone !== localStorage.getItem('siswaPhone')) {
          setMismatch(true);
          return;
        }
        sessionStorage.setItem('posttestVerified', 'true');
        // replace: tombol kembali dari halaman info tidak membuka verifikasi lagi
        navigate('/siswa/posttest-info', { replace: true });
        return;
      }

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
        if (existingUser.rekapPretest) localStorage.setItem('rekapPretest', existingUser.rekapPretest);
        if (existingUser.skorPosttest) localStorage.setItem('skorPosttest', existingUser.skorPosttest);
        if (existingUser.rekapPosttest) localStorage.setItem('rekapPosttest', existingUser.rekapPosttest);
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
  const tooShort = phone.length > 0 && !isValid;
  const inputError = tooShort || mismatch;

  return (
    <div className="m-app">
      <div className="m-screen nv-page">
        <div className="m-statusbar">
          <span>{currentTime}</span>
          <div className="m-statusbar-icons">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="10" x2="23" y2="14"/></svg>
          </div>
        </div>

        {/* Header */}
        <header className="m-header nv-header">
          <button type="button" className="nv-back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
            <ChevronLeft size={18} />
          </button>
          <div className="m-app-title">Si Iklim Muda</div>
          <div className="nv-badge"><div className="nv-badge-dot"></div> Siswa</div>
        </header>

        {/* Body */}
        <div className="m-body nv-body">
          <h1 className="nv-title">Verifikasi ID</h1>
          <p className="nv-subtitle">
            {untukPosttest
              ? 'Masukkan kembali nomor telepon Anda untuk memulai posttest.'
              : 'Masukkan nomor telepon Anda sebagai ID siswa untuk verifikasi identitas.'}
          </p>

          <form className="vid-form" onSubmit={handleSubmit}>
            {/* Input Card */}
            <div className="nv-card vid-card">
              <div className="vid-card-icon"><ShieldCheck size={26} strokeWidth={1.75} /></div>
              <label className="vid-label" htmlFor="vid-phone">
                Nomor Telepon (ID Siswa) <span className="req">*</span>
              </label>
              <div className="vid-input-wrap">
                <Phone size={17} className="vid-input-icon" />
                <input
                  id="vid-phone"
                  className={`vid-input${inputError ? ' invalid' : ''}`}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setMismatch(false); }}
                  required
                  maxLength={13}
                  aria-invalid={inputError}
                  aria-describedby="vid-phone-help"
                />
              </div>
              <p id="vid-phone-help" className={`vid-help${inputError ? ' error' : ''}`} role={mismatch ? 'alert' : undefined}>
                {mismatch
                  ? 'Nomor telepon tidak cocok dengan data Anda.'
                  : tooShort ? 'Minimal 10 digit nomor telepon.' : 'Gunakan nomor aktif, 10–13 digit angka.'}
              </p>
            </div>

            {/* Submit */}
            <div className="nv-footer">
              <button
                type="submit"
                className={`nv-btn${checking ? ' loading' : ''}`}
                disabled={!isValid || checking}
              >
                {checking ? (
                  <><div className="nv-spinner"></div> Memeriksa...</>
                ) : (
                  <>Lanjut <ArrowRight size={18} /></>
                )}
              </button>
              <p className="nv-note">
                <Info size={14} className="nv-note-icon" />
                <span>
                  {untukPosttest
                    ? 'Gunakan nomor telepon yang sama dengan saat Anda mendaftar.'
                    : 'Nomor ini menjadi ID unik Anda. Jika sudah pernah mendaftar, Anda akan otomatis masuk ke Dashboard.'}
                </span>
              </p>
            </div>
          </form>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default VerifikasiIDPage;
