import { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, Battery, Wifi, Signal, ClipboardCheck, Info, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

function SiswaHasilPretestPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [skorSaya, setSkorSaya] = useState(null);
  const [skorTertinggi, setSkorTertinggi] = useState(null);
  const [skorTerendah, setSkorTerendah] = useState(null);

  useEffect(() => {
    // Jam dinamis
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);

    // Hitung skor dari jawaban siswa yang tersimpan
    const skorPretest = parseInt(localStorage.getItem('skorPretest') || '0');
    setSkorSaya(skorPretest);

    // Hitung tertinggi & terendah dari database
    const fetchScores = async () => {
      try {
        const studentStr = localStorage.getItem('currentStudent');
        if (!studentStr) {
          setSkorTertinggi(skorPretest);
          setSkorTerendah(skorPretest);
          return;
        }
        const student = JSON.parse(studentStr);
        
        const response = await fetch(`http://localhost:8000/api/skor.php?sekolah_id=${student.sekolah_id}`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          const scores = result.data
            .map(item => item.pre_test_score)
            .filter(s => s !== null && s !== undefined);
            
          if (scores.length > 0) {
            setSkorTertinggi(Math.max(...scores, skorPretest));
            setSkorTerendah(Math.min(...scores, skorPretest));
          } else {
            setSkorTertinggi(skorPretest);
            setSkorTerendah(skorPretest);
          }
        } else {
          setSkorTertinggi(skorPretest);
          setSkorTerendah(skorPretest);
        }
      } catch (err) {
        console.error('Error fetching scores:', err);
        setSkorTertinggi(skorPretest);
        setSkorTerendah(skorPretest);
      }
    };
    fetchScores();

    return () => clearInterval(t);
  }, []);

  const handleNext = () => {
    const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    currentStudent.nilaiPretest = skorSaya;
    currentStudent.status = 'Sedang Modul';
    localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
    navigate('/siswa/modul');
  };

  const getScoreColor = (score) => {
    if (score === null) return '#64748b';
    if (score >= 80) return '#059669';
    if (score >= 60) return '#d97706';
    return '#dc2626';
  };

  const getScoreLabel = (score) => {
    if (score === null) return 'Belum ada data';
    if (score >= 80) return 'Sangat Baik 🎉';
    if (score >= 60) return 'Cukup Baik 👍';
    return 'Perlu Peningkatan 💪';
  };

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
            <span className="step-name">Hasil Pretest</span>
          </div>
          <div className="progress-bars">
            <div className="bar active"></div><div className="bar active"></div>
            <div className="bar"></div><div className="bar"></div>
          </div>
        </div>

        <div className="form-content" style={{ display: 'flex', flexDirection: 'column' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              <ClipboardCheck size={18} color="#059669" />
            </div>
            <h1 className="page-title">Hasil Pretest</h1>
          </div>
          <p className="page-subtitle">Berikut adalah hasil pretest yang telah kamu kerjakan.</p>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Skor Utama */}
            <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: 20, padding: '24px 20px', textAlign: 'center', boxShadow: '0 8px 24px rgba(30,58,138,0.3)' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Skor Pretest Kamu</div>
              <div style={{ fontSize: 60, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: -2 }}>
                {skorSaya !== null ? skorSaya : '—'}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6, fontWeight: 600 }}>
                {getScoreLabel(skorSaya)}
              </div>
            </div>

            {/* Statistik Perbandingan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: '#ffffff', borderRadius: 16, padding: '14px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                  <TrendingUp size={16} color="#059669" />
                </div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>Tertinggi</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#059669' }}>
                  {skorTertinggi !== null ? skorTertinggi : '—'}
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>dari semua peserta</div>
              </div>
              <div style={{ background: '#ffffff', borderRadius: 16, padding: '14px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                  <TrendingDown size={16} color="#dc2626" />
                </div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>Terendah</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#dc2626' }}>
                  {skorTerendah !== null ? skorTerendah : '—'}
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>dari semua peserta</div>
              </div>
            </div>

            {/* Info */}
            <div className="info-box" style={{ margin: 0 }}>
              <Info size={16} className="info-icon" />
              <p>Pretest selesai! Sekarang kamu dapat melanjutkan ke modul pembelajaran yang telah disiapkan.</p>
            </div>
          </div>

          <div className="submit-section" style={{ marginTop: 16, paddingBottom: 4 }}>
            <button className="submit-btn" onClick={handleNext}>
              Lanjut ke Modul
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>
      </div>
    </div>
  );
}

export default SiswaHasilPretestPage;
