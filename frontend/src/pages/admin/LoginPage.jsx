import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Check,
  RefreshCw,
  GraduationCap,
  BookOpen,
  X,
  AlertCircle
} from 'lucide-react';
import bmkgLogo from '../../assets/bmkg-logo.png';
import mascotImg from '../../assets/mascot.png';
import './LoginPage.css';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    nip: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nip: formData.nip,
          password: formData.password,
          remember: rememberMe
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        const { role, email } = data.data.user;
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email);

        if (role === 'siswa') {
          navigate('/siswa/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(data.message || 'Login gagal.');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      alert('Harap masukkan email Anda.');
      return;
    }
    setIsResetting(true);
    // Simulasi request reset password
    setTimeout(() => {
      setIsResetting(false);
      setResetSuccess(true);
    }, 1500);
  };

  return (
    <div className="login-page">
      {/* Navbar */}
      <nav className="login-navbar" id="login-navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <img src={bmkgLogo} alt="Logo BMKG" />
          </div>
          <div className="navbar-brand-text">
            <h1>Si Iklim Muda</h1>
            <p>Badan Meteorologi Klimatologi dan Geofisika</p>
          </div>
        </div>
        <div className="navbar-status">
          <span className="status-dot"></span>
          <span>Server Terhubung &amp; Terverifikasi</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="login-content">
        <div className="login-card">
          {/* Left Panel - Welcome */}
          <div className="login-welcome">
            <div className="welcome-badge">
              <BookOpen />
              <span>Edukasi Literasi Iklim</span>
            </div>
            <h2 className="welcome-title">Si Iklim Muda</h2>
            <p className="welcome-subtitle">
              Sistem Manajemen Pembelajaran &amp; Evaluasi Literasi Iklim
              Sekolah Binaan BMKG
            </p>
            <div className="welcome-chat-bubble">
              <p>
                Halo! Selamat datang di Portal Admin
                Si Iklim Muda BMKG <span className="emoji">👋</span>
              </p>
            </div>
            <div className="welcome-mascot">
              <img src={mascotImg} alt="Si Mego - Maskot BMKG" />
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="login-form-section">
            <div className="form-header">
              <h2>Masuk Akun Admin</h2>
              <p>Silakan masukkan email dan password Anda</p>
            </div>

            <form onSubmit={handleSubmit} id="login-form">
              {/* NIP Field */}
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="nip">Email</label>
                </div>
                <div className="input-wrapper">
                  <Mail />
                  <input
                    type="text"
                    id="nip"
                    name="nip"
                    placeholder="Contoh: admin@bmkg.go.id"
                    value={formData.nip}
                    onChange={handleInputChange}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="password">Password</label>
                  <button type="button" onClick={() => setShowForgotModal(true)} className="form-link" id="forgot-password-link">Lupa Password?</button>
                </div>
                <div className="input-wrapper">
                  <ShieldCheck />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="input-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    id="toggle-password-btn"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="form-options">
                <label className="checkbox-label" id="remember-me-label">
                  <div className="checkbox-custom">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      id="remember-me-checkbox"
                    />
                    <span className="checkmark">
                      <Check />
                    </span>
                  </div>
                  <span>Ingat saya</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-login"
                id="login-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Memproses...</>
                ) : (
                  <>
                    Masuk ke Dashboard
                    <ArrowRight />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </main>

      {/* Lupa Password Modal */}
      {showForgotModal && (
        <div className="hs-modal-overlay" onClick={() => { setShowForgotModal(false); setResetSuccess(false); setResetEmail(''); }}>
          <div className="hs-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="hs-modal-header" style={{ paddingBottom: '16px' }}>
              <div className="hs-modal-title-area">
                <div className="hs-modal-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="hs-modal-title">Lupa Password</h3>
                </div>
              </div>
              <button className="hs-modal-close" onClick={() => { setShowForgotModal(false); setResetSuccess(false); setResetEmail(''); }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="hs-modal-body">
              {resetSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', marginBottom: '16px' }}>
                    <Check size={24} />
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Tautan Terkirim!</h4>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
                    Kami telah mengirimkan instruksi untuk mereset password ke email <strong>{resetEmail}</strong>. Silakan periksa kotak masuk Anda.
                  </p>
                  <button 
                    onClick={() => { setShowForgotModal(false); setResetSuccess(false); setResetEmail(''); }}
                    style={{ marginTop: '24px', width: '100%', padding: '10px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit}>
                  <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '20px', lineHeight: '1.5' }}>
                    Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang password Anda.
                  </p>
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Email Terdaftar</label>
                    <div className="input-wrapper" style={{ height: '44px' }}>
                      <Mail size={16} />
                      <input 
                        type="email" 
                        required 
                        value={resetEmail} 
                        onChange={(e) => setResetEmail(e.target.value)} 
                        placeholder="Contoh: admin@bmkg.go.id" 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn-modal-cancel" onClick={() => setShowForgotModal(false)}>Batal</button>
                    <button type="submit" className="btn-modal-submit" disabled={isResetting}>
                      {isResetting ? 'Mengirim...' : 'Kirim Tautan'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="login-footer">
        <p>© 2025 Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) • Pusat Layanan Informasi Iklim Terapan. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;
