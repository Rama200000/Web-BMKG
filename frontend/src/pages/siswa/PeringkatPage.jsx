import { useEffect, useState } from 'react';
import { ChevronLeft, GraduationCap, Check, ArrowRight, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imgGraduationCap from '../../assets/fluent-emoji/graduation-cap.png';
import imgBooks from '../../assets/fluent-emoji/books.png';
import imgScroll from '../../assets/fluent-emoji/scroll.png';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './PeringkatPage.css';

// Data simulasi peserta lain (skor posttest & waktu pengerjaan dalam detik)
const PESERTA_LAIN = [
  { nama: 'Aulia Rahma Dila', skor: 98, waktu: 504 },
  { nama: 'Raihan Alvaro', skor: 95, waktu: 555 },
  { nama: 'Tiara Andini', skor: 92, waktu: 603 },
  { nama: 'Bagus Ali', skor: 88, waktu: 587 },
  { nama: 'Eka Putri', skor: 85, waktu: 620 },
];

/**
 * Papan peringkat 1–5 setelah posttest (urut skor posttest, lalu waktu tercepat).
 * Siswa yang sedang masuk ikut diperingkat dan ditandai "(Kamu)".
 */
function PeringkatPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const skorPosttest = localStorage.getItem('skorPosttest');
  const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // Belum mengerjakan posttest → belum ada peringkat
  useEffect(() => {
    if (skorPosttest === null) navigate('/siswa/dashboard', { replace: true });
  }, [skorPosttest, navigate]);

  const saya = {
    nama: student.nama || 'Kamu',
    skor: parseInt(skorPosttest || '0'),
    waktu: parseInt(localStorage.getItem('posttestTime') || '0'),
    isMe: true,
  };
  const top5 = [...PESERTA_LAIN, saya]
    .sort((a, b) => b.skor - a.skor || a.waktu - b.waktu)
    .slice(0, 5);
  const masukTop5 = top5.includes(saya);

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
          {/* Ucapan */}
          <section className="peringkat-hero">
            <div className="peringkat-hero-text">
              <h1 className="peringkat-hero-title">
                {masukTop5
                  ? <>Luar Biasa, Kamu adalah Bintang Iklim Muda! <span aria-hidden="true">🎉</span></>
                  : <>Terima Kasih Sudah Berjuang! <span aria-hidden="true">💪</span></>}
              </h1>
              <p className="peringkat-hero-sub">
                Berikut adalah peringkat 1 sampai 5 siswa terbaik yang telah menyelesaikan tugas dengan luar biasa.
                {masukTop5 && ' Pertahankan pencapaian luar biasamu dalam menguasai keselamatan kerja dan lingkungan.'}
                {' '}Teruslah belajar bersama Si Iklim Muda.
              </p>
            </div>
            <div className="peringkat-hero-art" aria-hidden="true">
              <img src={imgScroll} alt="" className="peringkat-art-scroll" />
              <img src={imgBooks} alt="" className="peringkat-art-books" />
              <img src={imgGraduationCap} alt="" className="peringkat-art-cap" />
            </div>
          </section>

          {/* Papan peringkat */}
          <h2 className="peringkat-title">Papan Peringkat 1–5</h2>
          <p className="peringkat-sub">Daftar nama siswa terbaik</p>

          <ol className="peringkat-list">
            {top5.map((p, i) => (
              <li key={p.isMe ? 'saya' : p.nama} className={`peringkat-row rank-${i + 1}${p.isMe ? ' me' : ''}`}>
                <div className="peringkat-avatar" aria-hidden="true"><UserRound size={24} strokeWidth={2} /></div>
                <span className="peringkat-name">
                  {i + 1}. {p.nama}{p.isMe && ' (Kamu)'} <span aria-hidden="true">🏆</span>
                </span>
                <span className="peringkat-check" aria-hidden="true"><Check size={13} strokeWidth={3.5} /></span>
              </li>
            ))}
          </ol>

          <div className="peringkat-info">
            <span className="peringkat-check" aria-hidden="true"><Check size={13} strokeWidth={3.5} /></span>
            <p>
              {masukTop5
                ? 'Selamat masuk 5 besar! Kerja kerasmu membuahkan hasil, terus pertahankan prestasi ini.'
                : 'Kamu belum masuk 5 besar. Terus belajar bersama Si Iklim Muda dan raih peringkat terbaikmu!'}
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
