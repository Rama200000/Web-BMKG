import { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, Battery, Wifi, Signal, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

function PretestSoalPage() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setShowModal(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    navigate('/siswa/hasil-pretest');
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

        <div className="progress-section" style={{ paddingBottom: 8 }}>
          <div className="progress-text">
            <span className="step-count">Langkah 3 dari 4</span>
            <span className="step-name">Soal 1</span>
          </div>
          <div className="progress-bars">
            <div className="bar active"></div>
            <div className="bar active"></div>
            <div className="bar active"></div>
            <div className="bar"></div>
          </div>
        </div>

        <div className="form-content" style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h1 className="page-title" style={{ margin: 0, fontSize: 20 }}>Pretest</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              <Clock size={14} />
              {formatTime(timeLeft)}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: 1 }}>Pertanyaan</span>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginTop: 8, lineHeight: 1.5 }}>
              Manakah pernyataan yang paling tepat mengenai materi yang sedang dipelajari?
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            {['Pilihan jawaban pertama mengenai konsep dasar materi', 'Pilihan jawaban kedua sebagai alternatif pemahaman', 'Pilihan jawaban ketiga yang menyajikan sudut pandang lain', 'Pilihan jawaban keempat untuk melengkapi opsi pemahaman'].map((opt, i) => {
              const letters = ['A', 'B', 'C', 'D'];
              const isSelected = selectedOption === i;
              return (
                <div 
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  style={{ 
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px', 
                    borderRadius: 16, border: `2px solid ${isSelected ? '#1e3a8a' : '#e2e8f0'}`,
                    backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ 
                    width: 24, height: 24, borderRadius: '50%', backgroundColor: isSelected ? '#1e3a8a' : '#f1f5f9',
                    color: isSelected ? 'white' : '#64748b', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0
                  }}>
                    {letters[i]}
                  </div>
                  <div style={{ fontSize: 13, color: '#334155', flex: 1, lineHeight: 1.4 }}>
                    {opt}
                  </div>
                  <div style={{ 
                    width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isSelected ? '#1e3a8a' : '#cbd5e1'}`,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0
                  }}>
                    {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#1e3a8a' }}></div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingBottom: 24 }}>
            <button style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: 600, fontSize: 14 }}>
              Sebelumnya
            </button>
            <button 
              onClick={handleNext}
              style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', backgroundColor: '#020617', color: 'white', fontWeight: 600, fontSize: 14 }}
            >
              Berikutnya →
            </button>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>

        {/* Modal Waktu Habis */}
        {showModal && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, padding: 24 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 24, padding: 32, width: '100%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
                <Clock size={32} color="#3b82f6" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Waktu Habis</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.5 }}>Durasi pengerjaan pretest Anda sudah selesai. Jawaban Anda akan segera dikirim.</p>
              <button onClick={handleNext} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', backgroundColor: '#020617', color: 'white', fontWeight: 600, fontSize: 14 }}>
                Lihat Hasil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PretestSoalPage;
