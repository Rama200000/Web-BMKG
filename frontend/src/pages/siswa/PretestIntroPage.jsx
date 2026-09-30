import { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, Battery, Wifi, Signal, Clock, Info, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

function PretestIntroPage() {
  const navigate = useNavigate();
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

  const rules = [
    { icon: '📋', text: '10 soal pilihan ganda' },
    { icon: '⏱️', text: 'Durasi 15 menit pengerjaan' },
    { icon: '🚫', text: 'Tidak dapat kembali ke soal sebelumnya' },
    { icon: '✅', text: 'Jawab semua soal sebelum waktu habis' },
  ];

  return (
    <div className="mobile-app-container">
      <div className="mobile-screen">
        <div className="status-bar">
          <span className="time">{currentTime}</span>
          <div className="status-icons"><Signal size={13} /><Wifi size={13} /><Battery size={15} /></div>
        </div>

        <header className="mobile-header">
          <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft size={18} /></button>
          <div className="app-title">
            <div className="app-logo-bg"><GraduationCap size={16} color="#1d4ed8" /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="badge-portal"><div className="dot"></div>Portal Siswa</div>
        </header>

        <div className="progress-section">
          <div className="progress-text">
            <span className="step-count">Langkah 2 dari 4</span>
            <span className="step-name">Pretest</span>
          </div>
          <div className="progress-bars">
            <div className="bar active"></div><div className="bar active"></div>
            <div className="bar"></div><div className="bar"></div>
          </div>
        </div>

        <div className="form-content" style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Hero card */}
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: 20, padding: '28px 24px', textAlign: 'center', marginBottom: 20, boxShadow: '0 8px 24px rgba(30,58,138,0.3)' }}>
            <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', borderRadius: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 12px', backdropFilter: 'blur(8px)' }}>
              <Clock size={28} color="white" />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Durasi Pengerjaan</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: -2 }}>15</div>
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Menit</div>
          </div>

          {/* Rules */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Petunjuk Pengerjaan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rules.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#ffffff', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 16 }}>{r.icon}</span>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{r.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info box */}
          <div className="info-box" style={{ marginBottom: 0 }}>
            <Info size={16} className="info-icon" />
            <p>Setelah waktu habis, soal akan secara otomatis terkirim dan tidak bisa diubah.</p>
          </div>

          <div className="submit-section" style={{ marginTop: 'auto', paddingTop: 16 }}>
            <button className="submit-btn" onClick={() => navigate('/siswa/pretest')}>
              <Zap size={17} />
              Mulai Mengerjakan
            </button>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>
      </div>
    </div>
  );
}

export default PretestIntroPage;
