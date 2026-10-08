import { useEffect, useState } from 'react';
import { ChevronLeft, GraduationCap, ClipboardCheck, Info, CircleAlert, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './HasilSkorPage.css';

/**
 * Hasil skor setelah pretest / posttest.
 * Lanjut → halaman "… Selesai!" (rincian benar/salah).
 */
function HasilSkorPage({ mode = 'pretest' }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const isPretest = mode === 'pretest';
  const label = isPretest ? 'Pretest' : 'Posttest';
  const skor = parseInt(localStorage.getItem(isPretest ? 'skorPretest' : 'skorPosttest') || '0');

  // Database comparison data
  const [skorTertinggi, setSkorTertinggi] = useState(0);
  const [skorTerendah, setSkorTerendah] = useState(0);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const studentStr = localStorage.getItem('currentStudent');
        if (!studentStr) {
          setSkorTertinggi(skor);
          setSkorTerendah(skor);
          return;
        }
        const student = JSON.parse(studentStr);
        
        const response = await fetch(`http://localhost:8000/api/skor.php?sekolah_id=${student.sekolah_id}`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          const scores = result.data
            .map(item => isPretest ? item.pre_test_score : item.post_test_score)
            .filter(s => s !== null && s !== undefined);
            
          if (scores.length > 0) {
            // Include current score in the calculation just in case it hasn't propagated to DB yet
            setSkorTertinggi(Math.max(...scores, skor));
            setSkorTerendah(Math.min(...scores, skor));
          } else {
            setSkorTertinggi(skor);
            setSkorTerendah(skor);
          }
        } else {
          setSkorTertinggi(skor);
          setSkorTerendah(skor);
        }
      } catch (err) {
        console.error('Error fetching scores:', err);
        setSkorTertinggi(skor);
        setSkorTerendah(skor);
      }
    };
    fetchScores();
  }, [isPretest, skor]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // Selalu ke Dashboard: kembali satu halaman akan membuka soal lagi
  const handleBack = () => {
    navigate('/siswa/dashboard', { replace: true });
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

        {/* Header */}
        <header className="m-header nv-header">
          <button type="button" className="nv-back-btn" onClick={handleBack} aria-label="Kembali ke Dashboard">
            <ChevronLeft size={18} />
          </button>
          <div className="m-app-title">
            <div className="nv-logo"><GraduationCap size={16} strokeWidth={2} /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="nv-badge"><div className="nv-badge-dot"></div> Siswa</div>
        </header>

        <div className="m-body nv-body hasil-body">
          <h1 className="hasil-title">Hasil {label}</h1>
          <p className="hasil-subtitle">
            {isPretest
              ? 'Berikut adalah hasil pretest yang telah kamu kerjakan.'
              : 'Berikut hasil posttest yang telah kamu kerjakan.'}
          </p>

          <section className="hasil-card">
            {/* Skor */}
            <div className="hasil-score">
              <div className="hasil-score-icon"><ClipboardCheck size={24} strokeWidth={2} /></div>
              <p className="hasil-score-eyebrow">Skor {label}</p>
              <p className="hasil-score-number">{skor}</p>
              <p className="hasil-score-caption">Skor kamu</p>
            </div>

            {/* Perbandingan */}
            <ul className="hasil-stats">
              <li className="hasil-stat">
                <div>
                  <p className="hasil-stat-title">Skor Tertinggi</p>
                  <p className="hasil-stat-desc">Skor tertinggi yang tercatat</p>
                </div>
                <p className="hasil-stat-value">{skorTertinggi}</p>
              </li>
              <li className="hasil-stat">
                <div>
                  <p className="hasil-stat-title">Skor Terendah</p>
                  <p className="hasil-stat-desc">Skor terendah yang tercatat</p>
                </div>
                <p className="hasil-stat-value">{skorTerendah}</p>
              </li>
            </ul>

            {isPretest && (
              <div className="hasil-info">
                <Info size={17} className="hasil-info-icon" />
                <p>Pretest selesai. Sekarang kamu dapat melanjutkan ke modul pembelajaran.</p>
              </div>
            )}
          </section>

          {!isPretest && (
            <section className="hasil-note">
              <div className="hasil-note-head">
                <div className="hasil-note-icon"><CircleAlert size={16} strokeWidth={2.25} /></div>
                <h2>Hasil Posttest</h2>
              </div>
              <p className="hasil-note-lead">Posttest telah selesai dikerjakan.</p>
              <p className="hasil-note-desc">Gunakan hasil ini sebagai gambaran pemahaman kamu setelah mempelajari materi.</p>
            </section>
          )}

          <div className="nv-footer">
            <button type="button" className="nv-btn" onClick={() => navigate(isPretest ? '/siswa/pretest-selesai' : '/siswa/posttest-selesai')}>
              Lanjut <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default HasilSkorPage;
