import { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, Battery, Wifi, Signal, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

const soalPosttest = [
  {
    id: 1,
    pertanyaan: 'Apa tujuan utama dari mempelajari materi literasi iklim yang telah kamu baca?',
    pilihan: [
      'Meningkatkan kemampuan matematika',
      'Memahami dampak perubahan iklim dan cara mitigasinya',
      'Mempelajari cara bertani di daerah tropis',
      'Memahami sistem pemerintahan'
    ],
    kunci: 1
  },
  {
    id: 2,
    pertanyaan: 'Berdasarkan modul yang telah kamu baca, apa yang dimaksud adaptasi iklim?',
    pilihan: [
      'Penyesuaian sistem alam dan manusia terhadap perubahan iklim',
      'Proses mengurangi emisi gas rumah kaca',
      'Penggunaan energi matahari',
      'Daur ulang sampah organik'
    ],
    kunci: 0
  },
  {
    id: 3,
    pertanyaan: 'Salah satu dampak perubahan iklim yang paling terasa di Indonesia adalah?',
    pilihan: [
      'Berkurangnya jumlah badai tropis',
      'Meningkatnya curah salju di dataran tinggi',
      'Kenaikan permukaan laut dan perubahan pola curah hujan',
      'Penurunan suhu rata-rata tahunan'
    ],
    kunci: 2
  },
];

function PosttestSoalPage() {
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
    soalPosttest.forEach((soal, i) => {
      if (jawabanMap[i] === soal.kunci) benar++;
    });
    return Math.round((benar / soalPosttest.length) * 100);
  };

  const handleSelect = (idx) => setJawaban({ ...jawaban, [currentQ]: idx });

  const handleNext = () => {
    if (currentQ < soalPosttest.length - 1) {
      setCurrentQ(p => p + 1);
    } else {
      const skor = hitungSkor(jawaban);
      localStorage.setItem('skorPosttest', skor.toString());
      navigate('/siswa/hasil-posttest');
    }
  };

  const soal = soalPosttest[currentQ];

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
            <span className="step-count">Soal {currentQ + 1} dari {soalPosttest.length}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, backgroundColor: isWarning ? '#fef2f2' : '#e0f2fe', color: isWarning ? '#b91c1c' : '#0369a1', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
              <Clock size={12} />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="progress-bars">
            {soalPosttest.map((_, i) => (
              <div key={i} className={`bar ${i <= currentQ ? 'active' : ''}`}></div>
            ))}
          </div>
        </div>

        <div className="form-content" style={{ display: 'flex', flexDirection: 'column' }}>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: '#faf5ff', color: '#7c3aed', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Post-test
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.55, margin: 0 }}>
              {soal.pertanyaan}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {soal.pilihan.map((opt, i) => {
              const isSelected = jawaban[currentQ] === i;
              const letters = ['A', 'B', 'C', 'D'];
              return (
                <div
                  key={i}
                  onClick={() => handleSelect(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
                    borderRadius: 14,
                    border: `2px solid ${isSelected ? '#7c3aed' : '#e2e8f0'}`,
                    background: isSelected ? 'linear-gradient(135deg, #faf5ff, #ede9fe)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(124,58,237,0.15)' : 'none',
                    transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: isSelected ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#f1f5f9',
                    color: isSelected ? 'white' : '#64748b',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: 12, fontWeight: 800, flexShrink: 0
                  }}>
                    {letters[i]}
                  </div>
                  <span style={{ fontSize: 13, color: isSelected ? '#6d28d9' : '#374151', fontWeight: isSelected ? 600 : 400, flex: 1, lineHeight: 1.4 }}>
                    {opt}
                  </span>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#7c3aed' : '#cbd5e1'}`,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0
                  }}>
                    {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }}></div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, paddingTop: 16, paddingBottom: 4 }}>
            {currentQ > 0 && (
              <button onClick={() => setCurrentQ(p => p - 1)} style={{ flex: 1, padding: '14px', borderRadius: 14, border: '1.5px solid #e2e8f0', backgroundColor: '#ffffff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                ← Sebelumnya
              </button>
            )}
            <button
              onClick={handleNext}
              className="submit-btn"
              style={{ flex: 2, borderRadius: 14, padding: '14px', background: 'linear-gradient(135deg, #5b21b6, #7c3aed)' }}
            >
              {currentQ < soalPosttest.length - 1 ? 'Berikutnya →' : 'Submit & Lihat Hasil'}
            </button>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>

        {showModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 20, padding: 24, backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '32px 24px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #faf5ff, #ede9fe)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
                <Clock size={32} color="#7c3aed" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Waktu Habis!</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>Waktu pengerjaan post-test telah habis. Jawaban Anda akan otomatis dikirim.</p>
              <button onClick={() => navigate('/siswa/hasil-posttest')} className="submit-btn" style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)' }}>
                <Zap size={17} /> Lihat Hasil Post-test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PosttestSoalPage;
