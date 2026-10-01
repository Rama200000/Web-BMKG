import { useEffect, useState } from 'react';
import { ChevronLeft, GraduationCap, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bankSoal } from './bankSoal';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './PretestSelesaiPage.css';

/**
 * "Pretest / Posttest Selesai!" — skor beserta jumlah benar & salah.
 * Pretest → Dashboard; Posttest → Papan Peringkat.
 */
function PretestSelesaiPage({ mode = 'pretest' }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const isPretest = mode === 'pretest';
  const label = isPretest ? 'Pretest' : 'Posttest';
  const skor = parseInt(localStorage.getItem(isPretest ? 'skorPretest' : 'skorPosttest') || '0');
  // { benar, total } — disimpan UjianPage saat ujian dikirim.
  // Ujian yang dikerjakan sebelum rekap disimpan: hitung dari skor & jumlah soal.
  const rekap = JSON.parse(localStorage.getItem(isPretest ? 'rekapPretest' : 'rekapPosttest') || 'null')
    ?? { benar: Math.round((skor / 100) * bankSoal.length), total: bankSoal.length };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

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
          <button type="button" className="nv-back-btn" onClick={() => navigate(isPretest ? '/siswa/hasil-pretest' : '/siswa/hasil-posttest', { replace: true })} aria-label={`Kembali ke Hasil ${label}`}>
            <ChevronLeft size={18} />
          </button>
          <div className="m-app-title">
            <div className="nv-logo"><GraduationCap size={16} strokeWidth={2} /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="nv-badge"><div className="nv-badge-dot"></div> Siswa</div>
        </header>

        <div className="m-body nv-body selesai-body">
          <section className="selesai-card selesai-hero">
            <div className="selesai-check" aria-hidden="true">
              <Check size={72} strokeWidth={3} />
            </div>
            <h1 className="selesai-title">{label} Selesai!</h1>
            <p className="selesai-desc">Selamat, Anda telah menyelesaikan {label}. Hasil Anda telah tersimpan.</p>
          </section>

          <section className="selesai-card selesai-score">
            <p className="selesai-score-main">Skor Anda : {skor}/100</p>
            <p className="selesai-score-detail">
              Benar : {rekap.benar} = Salah : {rekap.total - rekap.benar}
            </p>
          </section>

          <div className="nv-footer">
            {isPretest ? (
              <button type="button" className="nv-btn" onClick={() => navigate('/siswa/dashboard', { replace: true })}>
                Lanjut Ke Dashboard <ArrowRight size={18} />
              </button>
            ) : (
              <button type="button" className="nv-btn" onClick={() => navigate('/siswa/peringkat')}>
                Lanjut <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default PretestSelesaiPage;
