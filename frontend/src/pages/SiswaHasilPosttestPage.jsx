import { ChevronLeft, GraduationCap, Battery, Wifi, Signal, ClipboardCheck, Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

function SiswaHasilPosttestPage() {
  const navigate = useNavigate();

  // Mock top 5 scores
  const topScores = [
    { name: 'Budi Santoso', score: 100 },
    { name: 'Ayu Lestari', score: 95 },
    { name: 'Kamu (Data Pengguna)', score: 90 },
    { name: 'Dimas Aditya', score: 85 },
    { name: 'Rina Wijaya', score: 85 }
  ];

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
            <span className="step-name">Hasil Post-test</span>
          </div>
          <div className="progress-bars">
            <div className="bar active"></div>
            <div className="bar active"></div>
            <div className="bar active"></div>
            <div className="bar active"></div>
          </div>
        </div>

        <div className="form-content" style={{ display: 'flex', flexDirection: 'column' }}>
          
          <h1 className="page-title">Hasil Post-test</h1>
          <p className="page-subtitle">Berikut hasil post-test yang telah kamu kerjakan.</p>

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
              <h2 style={{ fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px 0', fontWeight: 700 }}>Skor Post-test</h2>
              <div style={{ fontSize: 56, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>90</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Skor Kamu</div>
            </div>

            {/* Top 5 Leaderboard */}
            <div style={{ backgroundColor: '#f8fafc', borderRadius: 20, padding: 20, border: '1px solid #e2e8f0', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Trophy size={18} color="#eab308" />
                <h3 style={{ margin: 0, fontSize: 14, color: '#0f172a', fontWeight: 700 }}>Top 5 Nilai Tertinggi</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {topScores.map((student, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '8px 12px', 
                    backgroundColor: student.name.includes('Kamu') ? '#e0f2fe' : '#ffffff', 
                    borderRadius: 12,
                    border: student.name.includes('Kamu') ? '1px solid #bae6fd' : '1px solid #f1f5f9'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 24, height: 24, borderRadius: '50%', 
                        backgroundColor: idx === 0 ? '#fef08a' : idx === 1 ? '#e2e8f0' : idx === 2 ? '#ffedd5' : '#f8fafc',
                        color: idx === 0 ? '#ca8a04' : idx === 1 ? '#64748b' : idx === 2 ? '#c2410c' : '#94a3b8',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 12, fontWeight: 700
                      }}>
                        {idx + 1}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: student.name.includes('Kamu') ? 700 : 500, color: student.name.includes('Kamu') ? '#0284c7' : '#334155' }}>
                        {student.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{student.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="submit-section" style={{ paddingBottom: 24 }}>
            <button className="submit-btn" onClick={() => navigate('/scan')} style={{ backgroundColor: '#1e3a8a' }}>
              Selesai & Kembali ke Awal
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>
      </div>
    </div>
  );
}

export default SiswaHasilPosttestPage;
