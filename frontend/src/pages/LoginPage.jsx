import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Check,
  RefreshCw,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import bmkgLogo from '../assets/bmkg-logo.png';
import mascotImg from '../assets/mascot.png';
import './LoginPage.css';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    nip: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
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

    // Dummy login: langsung sukses jika field tidak kosong
    setTimeout(() => {
      if (formData.nip && formData.password) {
        navigate('/dashboard');
      } else {
        alert('Harap isi Email dan Password terlebih dahulu.');
        setIsLoading(false);
      }
    }, 800); // Simulasi loading sedikit
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
                  <Building2 />
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
                  <a href="#" className="form-link" id="forgot-password-link">Lupa Password?</a>
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

      {/* Footer */}
      <footer className="login-footer">
        <p>© 2025 Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) • Pusat Layanan Informasi Iklim Terapan. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;
