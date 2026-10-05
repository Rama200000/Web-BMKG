import { useState, useEffect } from 'react';
import { ChevronLeft, Phone, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './VerifikasiIDPage.css';

const API_URL = 'http://localhost:8000/api/auth_siswa.php';

function VerifikasiIDPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const untukPosttest = searchParams.get('untuk') === 'posttest';
  
  const [phone, setPhone] = useState('+62');
  const [currentTime, setCurrentTime] = useState('');
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChecking(true);
    setErrorMsg('');

    try {
      if (untukPosttest) {
        // Mode post-test: verify phone matches currently logged-in student
        const currentPhone = localStorage.getItem('siswaPhone');
        if (phone !== currentPhone) {
          setErrorMsg('Nomor telepon tidak cocok dengan data sesi Anda saat ini.');
          setChecking(false);
          return;
        }
        sessionStorage.setItem('posttestVerified', 'true');
        setChecking(false);
        navigate('/siswa/posttest-info', { replace: true });
        return;
      }

      // Normal login verification
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ no_hp: phone })
      });
      
      const result = await response.json();

      if (result.success) {
        // Successfully found student
        localStorage.setItem('siswaPhone', phone);
        localStorage.setItem('currentStudent', JSON.stringify(result.data));
        localStorage.setItem('userRole', 'siswa'); // so ProtectedRoute passes if you have one
        
        navigate('/siswa/dashboard');
      } else if (response.status === 404) {
        // Number not found, redirect to register
        localStorage.setItem('siswaPhone', phone);
        navigate('/siswa/biodata');
      } else {
        // Other errors (e.g., account disabled)
        setErrorMsg(result.message || 'Terjadi kesalahan saat verifikasi.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal terhubung ke server database.');
    } finally {
      setChecking(false);
    }
  };

  const isValid = phone.length >= 12;
  const inputError = (phone.length > 0 && !isValid) || errorMsg !== '';

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
              : 'Masukkan nomor telepon Anda (ID Siswa) untuk masuk atau mendaftar.'}
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
                  placeholder="81234567890"
                  value={phone}
                  onChange={(e) => { 
                    let val = e.target.value;
                    if (!val.startsWith('+62')) val = '+62';
                    let digits = val.substring(3).replace(/\D/g, '');
                    if (digits.startsWith('0')) digits = digits.substring(1);
                    setPhone('+62' + digits);
                    setErrorMsg(''); 
                  }}
                  required
                  maxLength={15}
                  aria-invalid={inputError}
                />
              </div>
              <p className={`vid-help${inputError ? ' error' : ''}`}>
                {errorMsg 
                  ? errorMsg 
                  : (phone.length > 0 && !isValid) 
                    ? 'Minimal 10 digit nomor telepon.' 
                    : 'Nomor yang belum terdaftar akan otomatis diarahkan untuk pendaftaran.'}
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
                    ? 'Pastikan sesuai dengan akun yang Anda gunakan.'
                    : 'Akses ujian akan masuk langsung ke Dashboard setelah verifikasi.'}
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
