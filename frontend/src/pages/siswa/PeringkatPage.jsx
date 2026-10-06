import { useEffect, useState } from 'react';
import { ChevronLeft, GraduationCap, Check, ArrowRight, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imgGraduationCap from '../../assets/fluent-emoji/graduation-cap.png';
import imgBooks from '../../assets/fluent-emoji/books.png';
import imgScroll from '../../assets/fluent-emoji/scroll.png';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './PeringkatPage.css';



/**
 * Papan peringkat 1–5 setelah posttest (urut skor posttest, lalu waktu tercepat).
 * Siswa yang sedang masuk ikut diperingkat dan ditandai "(Kamu)".
 */
function PeringkatPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [top5, setTop5] = useState([]);
  const [loading, setLoading] = useState(true);
  const skorPosttest = localStorage.getItem('skorPosttest');
  const skorPretest = localStorage.getItem('skorPretest');
  const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');

  // Belum mengerjakan posttest → belum ada peringkat
  useEffect(() => {
    if (skorPosttest === null) navigate('/siswa/dashboard', { replace: true });
  }, [skorPosttest, navigate]);

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
    if (student.sekolah_id) {
      fetch(`http://localhost:8000/api/skor.php?sekolah_id=${student.sekolah_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            let list = data.data.map(d => ({
              nama: d.siswa,
              skor: Math.round(parseFloat(d.final_score || '0')),
              waktu: parseInt(d.post_test_time_seconds || '0'),
              isMe: d.hp === student.no_hp || d.hp === student.phone || d.siswa === student.nama
            }));
            
            let localPre = parseFloat(skorPretest || '0');
            let localPost = parseFloat(skorPosttest || '0');
            let finalLocal = localPost >= 100 ? 100 : ((localPost - localPre) / (100 - localPost)) * 100;

            const saya = {
              nama: student.nama || 'Kamu',
              skor: Math.round(finalLocal),
              waktu: parseInt(localStorage.getItem('posttestTime') || '0'),
              isMe: true,
            };
            if (!list.find(l => l.isMe)) {
               list.push(saya);
            }
            
            list.sort((a, b) => b.skor - a.skor || a.waktu - b.waktu);
            setTop5(list.slice(0, 5));
            setLoading(false);
          }
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [student.sekolah_id, student.no_hp, student.phone, student.nama, skorPosttest]);

  const masukTop5 = top5.find(p => p.isMe);
  const top3 = top5.slice(0, 3);
  const others = top5.slice(3, 5);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="m-app">
      <div className="m-screen nv-page peringkat-page">
        <div className="m-statusbar">
          <span>{currentTime}</span>
          <div className="m-statusbar-icons">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="10" x2="23" y2="14"/></svg>
          </div>
        </div>

        {/* Header */}
        <header className="m-header nv-header">
          <button type="button" className="nv-back-btn" onClick={() => navigate('/siswa/posttest-selesai', { replace: true })} aria-label="Kembali">
            <ChevronLeft size={18} />
          </button>
          <div className="m-app-title">
            <div className="nv-logo"><GraduationCap size={16} strokeWidth={2} /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="nv-badge"><div className="nv-badge-dot"></div> Siswa</div>
        </header>

        <div className="m-body nv-body peringkat-body">
          {/* Papan peringkat */}
          <h2 className="peringkat-title">Papan Peringkat 1–5</h2>
          <p className="peringkat-sub">Daftar nama siswa terbaik</p>

          <div className="peringkat-podium-container">
            {top3[1] && (
              <div className={`podium-item rank-2 ${top3[1].isMe ? 'me' : ''}`}>
                <div className="podium-avatar"><UserRound size={32} /></div>
                <div className="podium-name">{top3[1].nama}{top3[1].isMe && ' (Kamu)'}</div>
                <div className="podium-score">Skor: {top3[1].skor} | {formatTime(top3[1].waktu)}</div>
                <div className="podium-block">2</div>
              </div>
            )}
            
            {top3[0] && (
              <div className={`podium-item rank-1 ${top3[0].isMe ? 'me' : ''}`}>
                <div className="podium-avatar"><UserRound size={38} /></div>
                <div className="podium-name">{top3[0].nama}{top3[0].isMe && ' (Kamu)'}</div>
                <div className="podium-score">Skor: {top3[0].skor} | {formatTime(top3[0].waktu)}</div>
                <div className="podium-block">1</div>
              </div>
            )}

            {top3[2] && (
              <div className={`podium-item rank-3 ${top3[2].isMe ? 'me' : ''}`}>
                <div className="podium-avatar"><UserRound size={32} /></div>
                <div className="podium-name">{top3[2].nama}{top3[2].isMe && ' (Kamu)'}</div>
                <div className="podium-score">Skor: {top3[2].skor} | {formatTime(top3[2].waktu)}</div>
                <div className="podium-block">3</div>
              </div>
            )}
          </div>

          {others.length > 0 && (
            <ol className="peringkat-list" start="4">
              {others.map((p, i) => (
                <li key={p.isMe ? 'saya' : p.nama} className={`peringkat-row rank-${i + 4}${p.isMe ? ' me' : ''}`}>
                  <div className="peringkat-avatar" aria-hidden="true"><UserRound size={24} strokeWidth={2} /></div>
                  <div className="peringkat-details">
                    <span className="peringkat-name">
                      {i + 4}. {p.nama}{p.isMe && ' (Kamu)'}
                    </span>
                    <span className="peringkat-score">Skor: {p.skor} | {formatTime(p.waktu)}</span>
                  </div>
                </li>
              ))}
            </ol>
          )}

          <div className="peringkat-info">
            <span className="peringkat-check" aria-hidden="true"><Check size={13} strokeWidth={3.5} /></span>
            <p>
              {masukTop5
                ? 'Selamat! Kamu masuk Top 5 leaderboard. Kerja kerasmu membuahkan hasil, terus pertahankan prestasi ini.'
                : 'Tetap semangat! Anda belum masuk Top 5 leaderboard. Terus belajar bersama Si Iklim Muda dan raih peringkat terbaikmu!'}
            </p>
          </div>

          <div className="nv-footer">
            <button type="button" className="nv-btn" onClick={() => navigate('/siswa/dashboard', { replace: true })}>
              Lanjut ke Dashboard <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default PeringkatPage;
