import { ChevronLeft, GraduationCap, Battery, Wifi, Signal, Clock, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

function PosttestIntroPage() {
  const navigate = useNavigate();

  return (
    <div className="mobile-app-container">
      <div className="mobile-screen">
        <div className="status-bar">
          <span className="time">09.41</span>
          <div className="status-icons">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={16} />
          </div>
        </div>

        <header className="mobile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <div className="app-title">
            <div className="app-logo-bg">
              <GraduationCap size={16} color="#000" />
            </div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="badge-portal">
            <div className="dot"></div>
            Portal Siswa
          </div>
        </header>

        <div className="progress-section">
          <div className="progress-text">
            <span className="step-count">Langkah 4 dari 4</span>
            <span className="step-name">Post-test</span>
          </div>
          <div className="progress-bars">
            <div className="bar active"></div>
            <div className="bar active"></div>
            <div className="bar active"></div>
            <div className="bar active"></div>
          </div>
        </div>

        <div className="form-content" style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 40 }}>
            <div style={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: 24, 
              padding: '40px 20px', 
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <Clock size={36} color="#0ea5e9" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: 16, color: '#334155', margin: '0 0 8px 0' }}>Durasi Pengerjaan</h2>
              <div style={{ fontSize: 48, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>15</div>
              <div style={{ fontSize: 16, color: '#64748b', fontWeight: 600, marginTop: 4 }}>Menit</div>
            </div>

            <div className="info-box" style={{ marginTop: 24 }}>
              <Info size={18} className="info-icon" />
              <p>Setelah waktu habis, jawaban Anda akan otomatis dikirim.</p>
            </div>
          </div>

          <div className="submit-section" style={{ marginTop: 'auto' }}>
            <button className="submit-btn" onClick={() => navigate('/siswa/posttest')}>
              Mulai Mengerjakan
            </button>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>
      </div>
    </div>
  );
}

export default PosttestIntroPage;
