import { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, Send, Grid3X3, X, GraduationCap, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UJIAN_DURASI_MENIT } from './ujianConfig';
import { bankSoal } from './bankSoal';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './UjianPage.css';

const TIMER_SECONDS = UJIAN_DURASI_MENIT * 60;

function UjianPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'pretest';

  const [soalList, setSoalList] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [jawaban, setJawaban] = useState({}); // { [index]: choiceIndex }
  const [flagged, setFlagged] = useState({}); // { [index]: true }
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [startTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState('');
  // Warning states removed — auto-submit langsung saat keluar tab
  const [submitted, setSubmitted] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  // Ujian selesai → dialog dulu sebelum ke halaman hasil. 'submit' | 'waktu' | null
  const [selesai, setSelesai] = useState(null);

  // Clock & Shuffle Options
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);

    // Shuffle options once on mount
    const shuffle = (array) => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    const preparedSoal = bankSoal.map(s => {
      const options = s.pilihan.map((text, idx) => ({ text, isOriginalKey: idx === s.kunci }));
      return { ...s, pilihanShuffled: shuffle(options) };
    });
    setSoalList(preparedSoal);

    return () => clearInterval(t);
  }, []);

  // Submit handler
  const doSubmit = useCallback((alasan = 'submit') => {
    if (submitted || soalList.length === 0) return;
    setSubmitted(true);
    setShowGrid(false);

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    let benar = 0;
    soalList.forEach((soal, i) => {
      const selectedIndex = jawaban[i];
      if (selectedIndex !== undefined && soal.pilihanShuffled[selectedIndex].isOriginalKey) {
        benar++;
      }
    });
    const skor = Math.round((benar / soalList.length) * 100);

    // Save progress to user registry
    const phone = localStorage.getItem('siswaPhone') || '';
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');

    const rekap = JSON.stringify({ benar, total: soalList.length });
    if (mode === 'pretest') {
      localStorage.setItem('skorPretest', skor.toString());
      localStorage.setItem('rekapPretest', rekap);
      localStorage.setItem('pretestDone', 'true');
      localStorage.setItem('pretestTime', elapsed.toString());
      // Update registry
      if (users[phone]) {
        users[phone].pretestDone = true;
        users[phone].skorPretest = skor.toString();
        users[phone].rekapPretest = rekap;
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }
      if (student.phone) {
        student.pretestDone = true;
        student.skorPretest = skor.toString();
        localStorage.setItem('currentStudent', JSON.stringify(student));
      }
    } else {
      localStorage.setItem('skorPosttest', skor.toString());
      localStorage.setItem('rekapPosttest', rekap);
      localStorage.setItem('posttestTime', elapsed.toString());
      if (users[phone]) {
        users[phone].skorPosttest = skor.toString();
        users[phone].rekapPosttest = rekap;
        users[phone].posttestTime = elapsed.toString();
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }
    }
    setSelesai(alasan);
  }, [jawaban, mode, submitted, startTime, soalList]);

  // Countdown timer
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) { doSubmit('waktu'); return; }
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, doSubmit]);

  // Anti-cheat — langsung auto-submit saat keluar tab / ganti aplikasi
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !submitted) {
        doSubmit('curang');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [submitted, doSubmit]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const isWarningTime = timeLeft < 3 * 60;
  const totalSoal = soalList.length;
  const soal = totalSoal > 0 ? soalList[currentQ] : null;
  const label = ['A', 'B', 'C', 'D'];

  // Count stats
  const answeredCount = Object.keys(jawaban).length;
  const flaggedCount = Object.keys(flagged).filter(k => flagged[k]).length;
  const unansweredCount = totalSoal - answeredCount;

  const getQStatus = (i) => {
    if (flagged[i]) return 'flagged';
    if (jawaban[i] !== undefined) return 'answered';
    return 'unanswered';
  };

  const toggleFlag = () => {
    setFlagged(prev => ({ ...prev, [currentQ]: !prev[currentQ] }));
  };

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

        {/* App Header */}
        <header className="m-header nv-header">
          <button type="button" className="nv-back-btn" onClick={() => setConfirmExit(true)} aria-label="Keluar dari ujian">
            <ChevronLeft size={18} />
          </button>
          <div className="m-app-title">
            <div className="nv-logo"><GraduationCap size={16} strokeWidth={2} /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="nv-badge"><div className="nv-badge-dot"></div> Siswa</div>
        </header>

        {/* Ujian Header */}
        <div className="ujian-header">
          <div className="ujian-header-top">
            <h1 className="ujian-mode-badge">{mode === 'pretest' ? 'Pretest' : 'Posttest'}</h1>
            <div className={`ujian-timer ${isWarningTime ? 'warning' : ''}`} role="timer" aria-label="Sisa waktu">
              <Clock size={14} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="ujian-header-sub">
            <span className="ujian-question-info">Soal {currentQ + 1} dari {totalSoal}</span>
            <button className="ujian-grid-toggle" onClick={() => setShowGrid(true)}>
              <Grid3X3 size={16} />
              <span>Navigasi</span>
            </button>
          </div>
          <div className="ujian-progress-bar">
            <div className="ujian-progress-fill" style={{ width: `${((currentQ + 1) / totalSoal) * 100}%` }}></div>
          </div>
        </div>

        {/* Question Body */}
        <div className="m-body ujian-body">
          {soal && (
            <div className="ujian-question-card">
              <span className="ujian-question-eyebrow">Pertanyaan</span>
              <p className="ujian-question-text" id="ujian-question-text">{soal.pertanyaan}</p>
            </div>
          )}

          <div className="ujian-options" role="radiogroup" aria-labelledby="ujian-question-text">
            {soal && soal.pilihanShuffled.map((pil, i) => {
              const selected = jawaban[currentQ] === i;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`ujian-option ${selected ? 'selected' : ''}`}
                  onClick={() => setJawaban({ ...jawaban, [currentQ]: i })}
                >
                  <span className="ujian-option-label">{label[i]}</span>
                  <span className="ujian-option-text">{pil.text}</span>
                  <span className="ujian-option-radio" aria-hidden="true"></span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="ujian-bottom-nav">
          <button
            className="ujian-nav-btn back"
            onClick={() => setCurrentQ(p => Math.max(0, p - 1))}
            disabled={currentQ === 0}
          >
            <ChevronLeft size={18} />
            <span>Kembali</span>
          </button>

          <button
            className={`ujian-nav-btn flag ${flagged[currentQ] ? 'active' : ''}`}
            onClick={toggleFlag}
          >
            <Flag size={16} />
            <span>Ragu</span>
          </button>

          {currentQ < totalSoal - 1 ? (
            <button
              className="ujian-nav-btn next"
              onClick={() => setCurrentQ(p => Math.min(totalSoal - 1, p + 1))}
            >
              <span>Lanjut</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button className="ujian-nav-btn submit" onClick={() => doSubmit()}>
              <Send size={16} />
              <span>Submit</span>
            </button>
          )}
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>

        {/* ═══ Question Grid Overlay ═══ */}
        {showGrid && (
          <div className="m-overlay" onClick={() => setShowGrid(false)}>
            <div className="ujian-grid-panel" onClick={e => e.stopPropagation()}>
              <div className="ujian-grid-header">
                <h3>Navigasi Soal</h3>
                <button className="ujian-grid-close" onClick={() => setShowGrid(false)}><X size={18} /></button>
              </div>

              {/* Legend */}
              <div className="ujian-grid-legend">
                <div className="ujian-legend-item"><span className="ujian-legend-dot answered"></span>Dijawab ({answeredCount})</div>
                <div className="ujian-legend-item"><span className="ujian-legend-dot flagged"></span>Ragu ({flaggedCount})</div>
                <div className="ujian-legend-item"><span className="ujian-legend-dot unanswered"></span>Belum ({unansweredCount})</div>
              </div>

              {/* Grid */}
              <div className="ujian-grid-numbers">
                {soalList.map((_, i) => (
                  <button
                    key={i}
                    className={`ujian-grid-num ${getQStatus(i)} ${currentQ === i ? 'current' : ''}`}
                    onClick={() => { setCurrentQ(i); setShowGrid(false); }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button className="m-btn-primary" style={{ marginTop: 16 }} onClick={() => doSubmit()}>
                <Send size={16} /> Submit Semua Jawaban
              </button>
              <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>
                {answeredCount}/{totalSoal} soal terjawab • {flaggedCount} ragu-ragu
              </p>
            </div>
          </div>
        )}

        {/* Konfirmasi keluar dari ujian */}
        {confirmExit && (
          <div className="m-overlay" onClick={() => setConfirmExit(false)}>
            <div
              className="m-modal nv-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ujian-exit-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nv-dialog-icon"><LogOut size={22} /></div>
              <h3 id="ujian-exit-title">Keluar dari {mode === 'pretest' ? 'pretest' : 'posttest'}?</h3>
              <p>Jawaban yang sudah kamu pilih tidak akan disimpan, dan kamu harus mengulang dari awal.</p>
              <div className="nv-dialog-actions">
                <button type="button" className="nv-btn secondary" onClick={() => setConfirmExit(false)}>Batal</button>
                <button type="button" className="nv-btn" onClick={() => navigate('/siswa/dashboard', { replace: true })}>Keluar</button>
              </div>
            </div>
          </div>
        )}

        {/* Ujian selesai → lanjut ke halaman hasil */}
        {selesai && (
          <div className="m-overlay">
            <div
              className="m-modal nv-dialog ujian-done-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="ujian-done-title"
              aria-describedby="ujian-done-desc"
            >
              <div className="ujian-done-icon">
                {selesai === 'waktu' ? <Clock size={26} strokeWidth={1.75} /> : <CheckCircle2 size={26} strokeWidth={1.75} />}
              </div>
              <h3 id="ujian-done-title">{selesai === 'waktu' ? 'Waktu Habis' : 'Jawaban Terkirim'}</h3>
              <p id="ujian-done-desc">
                {selesai === 'waktu'
                  ? `Durasi pengerjaan ${mode} sudah selesai. Jawaban Anda akan segera dikirim.`
                  : `Semua jawaban ${mode} Anda sudah terkirim. Lihat skor yang Anda peroleh.`}
              </p>
              {/* replace: tombol back dari halaman hasil tidak membuka soal lagi */}
              <button
                type="button"
                className="nv-btn"
                autoFocus
                onClick={() => navigate(mode === 'pretest' ? '/siswa/hasil-pretest' : '/siswa/hasil-posttest', { replace: true })}
              >
                Lihat Hasil
              </button>
            </div>
          </div>
        )}

        {/* Anti-cheat: Warning dihapus — langsung auto-submit */}
      </div>
    </div>
  );
}

export default UjianPage;
