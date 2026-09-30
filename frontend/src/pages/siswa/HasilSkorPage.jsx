import { useEffect, useState } from 'react';
import { ChevronLeft, Leaf, Trophy, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './mobile-green-theme.css';
import './HasilSkorPage.css';

function HasilSkorPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const skor = parseInt(localStorage.getItem('skorPretest') || '0');

  // Simulated comparison data
  const skorTertinggi = 95;
  const skorTerendah = 30;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  const handleBack = () => {
    navigate('/siswa/dashboard');
  };

  const getScoreColor = (s) => {
    if (s >= 80) return '#059669';
    if (s >= 60) return '#D97706';
    return '#DC2626';
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return 'Sangat Baik! 🌟';
    if (s >= 60) return 'Cukup Baik 👍';
    return 'Perlu Ditingkatkan 💪';
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
          <div className="m-badge"><div className="m-badge-dot"></div> Pretest</div>
        </header>

        <div className="m-body hasil-body">
          {/* Score Circle */}
          <div className="hasil-score-section">
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: '0 0 20px 0', textAlign: 'center' }}>
              Hasil Pretest Kamu
            </h2>
            <div className="hasil-score-circle" style={{ '--score-color': getScoreColor(skor) }}>
              <div className="hasil-score-ring">
                <svg viewBox="0 0 120 120" className="hasil-ring-svg">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke={getScoreColor(skor)} strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(skor / 100) * 327} 327`}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
                <div className="hasil-score-value">
                  <span className="hasil-score-number" style={{ color: getScoreColor(skor) }}>{skor}</span>
                  <span className="hasil-score-max">/100</span>
                </div>
              </div>
            </div>
            <p className="hasil-score-label" style={{ color: getScoreColor(skor) }}>{getScoreLabel(skor)}</p>
          </div>

          {/* Comparison Cards */}
          <div className="hasil-comparison">
            <div className="hasil-comp-card">
              <div className="m-icon-circle green"><TrendingUp size={18} /></div>
              <div>
                <p className="hasil-comp-label">Skor Tertinggi</p>
                <p className="hasil-comp-value" style={{ color: '#059669' }}>{skorTertinggi}</p>
              </div>
            </div>
            <div className="hasil-comp-card">
              <div className="m-icon-circle red"><TrendingDown size={18} /></div>
              <div>
                <p className="hasil-comp-label">Skor Terendah</p>
                <p className="hasil-comp-value" style={{ color: '#DC2626' }}>{skorTerendah}</p>
              </div>
            </div>
          </div>

          <div className="m-info-box" style={{ marginTop: 20 }}>
            <Trophy size={16} className="m-info-icon" />
            <p>Pretest selesai! Selanjutnya, pelajari <strong>Modul Pembelajaran</strong> yang sudah terbuka di Dashboard.</p>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 24 }}>
            <button className="m-btn-primary" onClick={handleBack}>
              Kembali ke Dashboard
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default HasilSkorPage;
