import { ChevronLeft, GraduationCap, Battery, Wifi, Signal, ClipboardCheck, Info, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

function SiswaHasilPretestPage() {
  const navigate = useNavigate();

  const handleNext = () => {
    // Simpan nilai pretest
    const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    currentStudent.nilaiPretest = 80;
    currentStudent.status = 'Sedang Modul';
    localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
    
    navigate('/siswa/modul');
  };

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
            <span className="step-name">Hasil Pretest</span>
          </div>
          <div className="progress-bars">
            <div className="bar active"></div>
            <div className="bar active"></div>
            <div className="bar active"></div>
            <div className="bar active"></div>
          </div>
        </div>

        <div className="form-content" style={{ display: 'flex', flexDirection: 'column' }}>
          
          <h1 className="page-title">Hasil Pretest</h1>
          <p className="page-subtitle">Berikut adalah hasil pretest yang telah kamu kerjakan.</p>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: 24, 
              padding: '32px 20px', 
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              marginBottom: 24
            }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 12px' }}>
                <ClipboardCheck size={24} />
              </div>
              <h2 style={{ fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px 0', fontWeight: 700 }}>Skor Pretest</h2>
              <div style={{ fontSize: 56, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>80</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Skor Kamu</div>

              <div style={{ borderTop: '1px solid #e2e8f0', margin: '24px 0 16px', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Skor Tertinggi</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Skor tertinggi yang tercatat</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>95</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Skor Terendah</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Skor terendah yang tercatat</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>60</div>
                </div>
              </div>

            </div>

            <div className="info-box" style={{ margin: 0 }}>
              <Info size={18} className="info-icon" />
              <p>Pretest selesai. Sekarang kamu dapat melanjutkan ke modul pembelajaran.</p>
            </div>
          </div>

          <div className="submit-section" style={{ marginTop: 24, paddingBottom: 24 }}>
            <button className="submit-btn" onClick={handleNext}>
              Lanjut ke Modul
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>
      </div>
    </div>
  );
}

export default SiswaHasilPretestPage;
