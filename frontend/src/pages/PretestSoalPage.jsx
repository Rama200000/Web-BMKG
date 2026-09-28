import { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, Battery, Wifi, Signal, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

const soalPretest = [
  {
    id: 1,
    pertanyaan: 'Manakah pernyataan yang paling tepat mengenai perubahan iklim global?',
    pilihan: [
      'Perubahan iklim hanya terjadi di daerah tropis',
      'Peningkatan suhu bumi akibat emisi gas rumah kaca',
      'Perubahan iklim tidak berpengaruh pada curah hujan',
      'Perubahan iklim adalah fenomena alam biasa yang tidak berbahaya'
    ],
    kunci: 1
  },
  {
    id: 2,
    pertanyaan: 'Apa yang dimaksud dengan efek rumah kaca?',
    pilihan: [
      'Proses pertanian di dalam rumah kaca',
      'Fenomena memanasnya Bumi akibat gas-gas atmosfer menyerap radiasi inframerah',
      'Penggunaan energi surya untuk rumah tangga',
      'Metode penyimpanan karbon di lautan'
    ],
    kunci: 1
  },
  {
    id: 3,
    pertanyaan: 'Gas apakah yang paling banyak berkontribusi terhadap pemanasan global?',
    pilihan: ['Oksigen (O₂)', 'Nitrogen (N₂)', 'Karbon Dioksida (CO₂)', 'Hidrogen (H₂)'],
    kunci: 2
  },
];

function PretestSoalPage() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [jawaban, setJawaban] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    if (timeLeft <= 0) { setShowModal(true); return; }
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const isWarning = timeLeft < 3 * 60;

  const hitungSkor = (jawabanMap) => {
    let benar = 0;
    soalPretest.forEach((soal, i) => {
      if (jawabanMap[i] === soal.kunci) benar++;
    });
    return Math.round((benar / soalPretest.length) * 100);
  };

  const handleNext = () => {
    if (currentQ < soalPretest.length - 1) {
      setCurrentQ(p => p + 1);
    } else {
      const skor = hitungSkor(jawaban);
      localStorage.setItem('skorPretest', skor.toString());
      navigate('/siswa/hasil-pretest');
    }
  };

  const soal = soalPretest[currentQ];

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
            <span className="step-count">Soal {currentQ + 1} dari {soalPretest.length}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, backgroundColor: isWarning ? '#fef2f2' : '#e0f2fe', color: isWarning ? '#b91c1c' : '#0369a1', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
              <Clock size={12} />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="progress-bars">
            {soalPretest.map((_, i) => (
              <div key={i} className={`bar ${i <= currentQ ? 'active' : ''}`}></div>
            ))}
          </div>
        </div>

        <div className="form-content" style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Question Label + Text */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Pretest
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.55, margin: 0 }}>
              {soal.pertanyaan}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {soal.pilihan.map((opt, i) => {
              const isSelected = jawaban[currentQ] === i;
              const letters = ['A', 'B', 'C', 'D'];
              return (
                <div
                  key={i}
                  onClick={() => handleSelect(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px',
                    borderRadius: 14,
                    border: `2px solid ${isSelected ? '#1e3a8a' : '#e2e8f0'}`,
                    background: isSelected ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(30,58,138,0.15)' : 'none',
                    transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: isSelected ? 'linear-gradient(135deg, #1e3a8a, #2563eb)' : '#f1f5f9',
                    color: isSelected ? 'white' : '#64748b',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: 12, fontWeight: 800, flexShrink: 0
                  }}>
                    {letters[i]}
                  </div>
                  <span style={{ fontSize: 13, color: isSelected ? '#1e3a8a' : '#374151', fontWeight: isSelected ? 600 : 400, flex: 1, lineHeight: 1.4 }}>
                    {opt}
                  </span>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#1e3a8a' : '#cbd5e1'}`,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0
                  }}>
                    {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1e3a8a' }}></div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 16, paddingBottom: 4 }}>
            {currentQ > 0 && (
              <button onClick={() => setCurrentQ(p => p - 1)} style={{ flex: 1, padding: '14px', borderRadius: 14, border: '1.5px solid #e2e8f0', backgroundColor: '#ffffff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                ← Sebelumnya
              </button>
            )}
            <button
              onClick={handleNext}
              className="submit-btn"
              style={{ flex: 2, borderRadius: 14, padding: '14px' }}
            >
              {currentQ < soalPretest.length - 1 ? 'Berikutnya →' : 'Selesai & Lihat Hasil'}
            </button>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>

        {/* Modal Waktu Habis */}
        {showModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 20, padding: 24, backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '32px 24px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
                <Clock size={32} color="#1d4ed8" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Waktu Habis!</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>Waktu pengerjaan pretest telah habis. Jawaban Anda akan otomatis dikirim.</p>
              <button onClick={() => navigate('/siswa/hasil-pretest')} className="submit-btn">
                <Zap size={17} /> Lihat Hasil Pretest
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PretestSoalPage;
