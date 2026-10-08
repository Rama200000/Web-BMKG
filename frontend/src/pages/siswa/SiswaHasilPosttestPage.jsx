import { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, Battery, Wifi, Signal, ClipboardCheck, Trophy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

function SiswaHasilPosttestPage() {
  const navigate = useNavigate();
  const [selesai, setSelesai] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [topScores, setTopScores] = useState([]);
  const [skorSaya, setSkorSaya] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    const skor = parseInt(localStorage.getItem('skorPosttest') || '0');
    setSkorSaya(skor);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchTopScores = async () => {
      try {
        const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');
        const myScore = parseInt(localStorage.getItem('skorPosttest') || '0');
        
        const res = await fetch('http://localhost:8000/api/skor.php');
        const result = await res.json();
        
        if (result.success) {
          let data = result.data.map(item => ({
            name: item.siswa,
            score: Math.round(item.post_test_score || 0),
            isMe: item.siswa === student.nama
          }));
          
          const isCurrentUserInDB = data.some(d => d.name === student.nama);
          if (!isCurrentUserInDB && student.nama) {
             data.push({ name: student.nama, score: myScore, isMe: true });
          } else if (isCurrentUserInDB) {
             const userIndex = data.findIndex(d => d.name === student.nama);
             data[userIndex].score = myScore; // sync local score
             data[userIndex].isMe = true;
          }

          const sorted = data.sort((a, b) => b.score - a.score).slice(0, 5);
          setTopScores(sorted);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTopScores();
  }, []);

  const handleFinish = () => {
    localStorage.removeItem('currentStudent');
    setSelesai(true);
  };

  // Tampilan "Selesai" — muncul setelah tombol selesai diklik
  if (selesai) {
    return (
      <div className="mobile-app-container">
        <div className="mobile-screen">
          <div className="status-bar">
            <span className="time">{currentTime}</span>
            <div className="status-icons"><Signal size={13} /><Wifi size={13} /><Battery size={15} /></div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24, boxShadow: '0 8px 24px rgba(16,185,129,0.25)' }}>
              <CheckCircle size={44} color="#059669" />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 12, letterSpacing: -0.5 }}>Terima Kasih! 🎉</h1>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, marginBottom: 8 }}>
              Kamu telah menyelesaikan seluruh rangkaian asesmen <strong>Si Iklim Muda</strong>.
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
              Data hasil asesmen kamu telah berhasil disimpan. Silakan kembalikan perangkat ini kepada panitia.
            </p>
            <div style={{ marginTop: 40, padding: '16px 24px', background: '#f0fdf4', borderRadius: 16, border: '1px solid #d1fae5', width: '100%' }}>
              <div style={{ fontSize: 12, color: '#15803d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Sesi Berakhir</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#059669', marginTop: 4 }}>Skor Post-test: {skorSaya}</div>
            </div>
          </div>
          <div className="home-indicator"><div className="indicator-line"></div></div>
        </div>
      </div>
    );
  }

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
            <span className="step-count">Langkah 4 dari 4</span>
            <span className="step-name">Hasil Post-test</span>
          </div>
          <div className="progress-bars">
            <div className="bar active"></div><div className="bar active"></div>
            <div className="bar active"></div><div className="bar active"></div>
          </div>
        </div>

        <div className="form-content" style={{ display: 'flex', flexDirection: 'column' }}>

          <h1 className="page-title">Hasil Post-test</h1>
          <p className="page-subtitle">Berikut hasil post-test yang telah kamu kerjakan.</p>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Skor Card */}
            <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: 20, padding: '24px 20px', textAlign: 'center', marginBottom: 16, boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 10px' }}>
                <ClipboardCheck size={22} color="white" />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Skor Post-test</div>
              <div style={{ fontSize: 54, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: -2 }}>{skorSaya}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Nilai Kamu</div>
            </div>

            {/* Top 5 Leaderboard */}
            <div style={{ background: '#ffffff', borderRadius: 18, padding: '16px', border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Trophy size={16} color="#eab308" />
                <h3 style={{ margin: 0, fontSize: 13, color: '#0f172a', fontWeight: 700 }}>Top 5 Nilai Tertinggi</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {topScores.map((student, idx) => (
                  <div key={idx} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px',
                    background: student.isMe ? 'linear-gradient(135deg, #ede9fe, #ddd6fe)' : '#f8fafc',
                    borderRadius: 12,
                    border: student.isMe ? '1.5px solid #a78bfa' : '1px solid #f1f5f9'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 8,
                        background: idx === 0 ? '#fef08a' : idx === 1 ? '#e2e8f0' : idx === 2 ? '#fed7aa' : '#f1f5f9',
                        color: idx === 0 ? '#a16207' : idx === 1 ? '#475569' : idx === 2 ? '#9a3412' : '#64748b',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 12, fontWeight: 800
                      }}>
                        {idx + 1}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: student.isMe ? 700 : 500, color: student.isMe ? '#6d28d9' : '#334155' }}>
                        {student.name} {student.isMe && '(Kamu)'}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: student.isMe ? '#7c3aed' : '#0f172a' }}>{student.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="submit-section" style={{ paddingBottom: 4 }}>
            <button className="submit-btn" onClick={handleFinish} style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
              <CheckCircle size={17} />
              Selesai
            </button>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>
      </div>
    </div>
  );
}

export default SiswaHasilPosttestPage;
