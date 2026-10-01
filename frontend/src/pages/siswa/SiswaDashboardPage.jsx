import { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, Lock, CheckCircle2, ChevronRight, Info, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imgGraduationCap from '../../assets/fluent-emoji/graduation-cap.png';
import imgBooks from '../../assets/fluent-emoji/books.png';
import imgScroll from '../../assets/fluent-emoji/scroll.png';
import imgMemo from '../../assets/fluent-emoji/memo.png';
import imgClipboard from '../../assets/fluent-emoji/clipboard.png';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './SiswaDashboardPage.css';

function SiswaDashboardPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [confirmExit, setConfirmExit] = useState(false);

  // Status dibaca sekali saat halaman dibuka
  const [progress] = useState(() => ({
    pretestDone: localStorage.getItem('pretestDone') === 'true',
    modulDone: localStorage.getItem('modulDone') === 'true',
    posttestDone: localStorage.getItem('skorPosttest') !== null,
  }));
  const { pretestDone, modulDone, posttestDone } = progress;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  const handleCardClick = (type) => {
    if (type === 'pretest') {
      if (pretestDone) navigate('/siswa/hasil-pretest');
      else navigate('/siswa/pretest-info');
    } else if (type === 'modul' && pretestDone) {
      navigate('/siswa/modul');
    } else if (type === 'posttest' && modulDone) {
      if (posttestDone) navigate('/siswa/hasil-posttest');
      else navigate('/siswa/scan?untuk=posttest');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('siswaPhone');
    localStorage.removeItem('currentStudent');
    localStorage.removeItem('pretestDone');
    localStorage.removeItem('modulDone');
    localStorage.removeItem('skorPretest');
    localStorage.removeItem('rekapPretest');
    localStorage.removeItem('skorPosttest');
    localStorage.removeItem('rekapPosttest');
    localStorage.removeItem('pretestTime');
    localStorage.removeItem('posttestTime');
    navigate('/siswa/scan');
  };

  const menus = [
    {
      key: 'pretest',
      title: 'Pretest',
      desc: 'Uji kemampuan awalmu sebelum memulai pembelajaran.',
      doneDesc: 'Sudah dikerjakan. Ketuk untuk lihat hasil.',
      img: imgMemo,
      unlocked: true,
      done: pretestDone,
      lockHint: '',
    },
    {
      key: 'modul',
      title: 'Modul',
      desc: 'Pelajari dan tambah wawasanmu disini',
      doneDesc: 'Sudah dipelajari. Ketuk untuk baca lagi.',
      img: imgBooks,
      unlocked: pretestDone,
      done: modulDone,
      lockHint: 'Selesaikan Pretest terlebih dahulu',
    },
    {
      key: 'posttest',
      title: 'Posttest',
      desc: 'Uji kembali pemahamanmu setelah mempelajari modul.',
      doneDesc: 'Sudah dikerjakan. Ketuk untuk lihat hasil.',
      img: imgClipboard,
      unlocked: modulDone,
      done: posttestDone,
      lockHint: 'Selesaikan Modul terlebih dahulu',
    },
  ];

  return (
    <div className="m-app">
      <div className="m-screen nv-page">
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
          <button type="button" className="nv-back-btn" onClick={() => setConfirmExit(true)} aria-label="Keluar dari portal">
            <ChevronLeft size={18} />
          </button>
          <div className="m-app-title">
            <div className="nv-logo"><GraduationCap size={16} strokeWidth={2} /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="nv-badge"><div className="nv-badge-dot"></div> Siswa</div>
        </header>

        {/* Body */}
        <div className="m-body nv-body dash-body">
          {/* Hero */}
          <section className="dash-hero">
            <div className="dash-hero-text">
              <h1 className="dash-hero-title">Halo, Selamat Datang! <span aria-hidden="true">👋</span></h1>
              <p className="dash-hero-sub">
                Tingkatkan pengetahuanmu tentang keselamatan kerja dan lingkungan bersama Si Iklim Muda.
              </p>
            </div>
            <div className="dash-hero-art" aria-hidden="true">
              <img src={imgScroll} alt="" className="dash-hero-scroll" />
              <img src={imgBooks} alt="" className="dash-hero-books" />
              <img src={imgGraduationCap} alt="" className="dash-hero-cap" />
            </div>
          </section>

          {/* Menu */}
          <h2 className="dash-section-title">Menu Utama</h2>
          <p className="dash-section-sub">Pilih menu yang ingin kamu akses.</p>

          <div className="dash-menu">
            {menus.map((m) => {
              const state = !m.unlocked ? 'locked' : m.done ? 'done' : 'active';
              return (
                <button
                  key={m.key}
                  type="button"
                  className={`dash-menu-card ${state}`}
                  onClick={() => handleCardClick(m.key)}
                  disabled={!m.unlocked}
                  aria-label={!m.unlocked ? `${m.title}, terkunci. ${m.lockHint}` : undefined}
                  title={!m.unlocked ? m.lockHint : undefined}
                >
                  <span className="dash-menu-icon">
                    <img src={m.img} alt="" />
                  </span>
                  <span className="dash-menu-text">
                    <span className="dash-menu-title">{m.title}</span>
                    <span className="dash-menu-desc">{m.done ? m.doneDesc : m.desc}</span>
                  </span>
                  {state === 'locked' && (
                    <span className="dash-menu-status lock"><Lock size={16} strokeWidth={2.25} /></span>
                  )}
                  {state === 'done' && (
                    <span className="dash-menu-status done"><CheckCircle2 size={18} strokeWidth={2.25} /></span>
                  )}
                  {state === 'active' && m.key !== 'pretest' && (
                    <span className="dash-menu-status go"><ChevronRight size={18} /></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Info */}
          <div className="dash-info">
            <Info size={18} className="dash-info-icon" />
            <span className="dash-info-divider" aria-hidden="true"></span>
            <p>Kerjakan setiap tahapan dengan sungguh - sungguh untuk mendapatkan hasil terbaik!</p>
          </div>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>

        {/* Konfirmasi keluar */}
        {confirmExit && (
          <div className="m-overlay" onClick={() => setConfirmExit(false)}>
            <div
              className="m-modal nv-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="dash-exit-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nv-dialog-icon"><LogOut size={22} /></div>
              <h3 id="dash-exit-title">Keluar dari portal?</h3>
              <p>Progres kamu tetap tersimpan. Masuk lagi dengan nomor telepon yang sama untuk melanjutkan.</p>
              <div className="nv-dialog-actions">
                <button type="button" className="nv-btn secondary" onClick={() => setConfirmExit(false)}>Batal</button>
                <button type="button" className="nv-btn" onClick={handleLogout}>Keluar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SiswaDashboardPage;
