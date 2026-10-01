import { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, Clock, ShieldAlert, AlertTriangle, Ban, ListChecks } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UJIAN_DURASI_MENIT } from './ujianConfig';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './PretestIntroPage.css';

/**
 * Informasi sebelum pretest / posttest dimulai (durasi & aturan waktu habis).
 * Timer baru berjalan setelah siswa menekan "Mulai Mengerjakan".
 */
function PretestIntroPage({ mode = 'pretest' }) {
  const navigate = useNavigate();
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
    if (mode === 'pretest') {
      // Pretest sudah dikerjakan → langsung ke hasil, tidak bisa mengulang
      if (localStorage.getItem('pretestDone') === 'true') {
        navigate('/siswa/hasil-pretest', { replace: true });
      }
      return;
    }
    // Posttest: sudah dikerjakan → hasil posttest; belum scan & verifikasi nomor → scan dulu
    if (localStorage.getItem('skorPosttest') !== null) {
      navigate('/siswa/hasil-posttest', { replace: true });
    } else if (sessionStorage.getItem('posttestVerified') !== 'true') {
      navigate('/siswa/scan?untuk=posttest', { replace: true });
    }
  }, [mode, navigate]);

  // replace: tombol kembali dari halaman soal tidak kembali ke halaman info ini
  const handleStart = () => {
    if (mode === 'posttest') sessionStorage.removeItem('posttestVerified');
    navigate(`/siswa/ujian?mode=${mode}`, { replace: true });
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
          <button type="button" className="nv-back-btn" onClick={() => navigate('/siswa/dashboard')} aria-label="Kembali ke menu">
            <ChevronLeft size={18} />
          </button>
          <div className="m-app-title">
            <div className="nv-logo"><GraduationCap size={16} strokeWidth={2} /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="nv-badge"><div className="nv-badge-dot"></div> Siswa</div>
        </header>

        {/* Body */}
        <div className="m-body nv-body pi-body">
          {/* Durasi */}
          <section className="pi-duration" aria-label={`Durasi pengerjaan ${UJIAN_DURASI_MENIT} menit`}>
            <div className="pi-duration-icon"><Clock size={20} strokeWidth={2.25} /></div>
            <h1 className="pi-duration-label">Durasi Pengerjaan</h1>
            <div className="pi-duration-value">{UJIAN_DURASI_MENIT}</div>
            <div className="pi-duration-unit">Menit</div>
          </section>

          {/* Aturan Pengerjaan */}
          <div className="pi-rules">
            <h2 className="pi-rules-title">
              <ListChecks size={16} />
              Aturan Pengerjaan
            </h2>
            <ul className="pi-rules-list">
              <li className="pi-rule-item pi-rule-danger">
                <div className="pi-rule-icon danger"><Ban size={14} /></div>
                <div>
                  <strong>Keluar Tab = Otomatis Submit</strong>
                  <p>Jawaban terkirim jika pindah aplikasi.</p>
                </div>
              </li>
              <li className="pi-rule-item">
                <div className="pi-rule-icon warning"><Clock size={14} /></div>
                <div>
                  <strong>Waktu {UJIAN_DURASI_MENIT} Menit</strong>
                  <p>Sistem otomatis submit saat waktu habis.</p>
                </div>
              </li>
              <li className="pi-rule-item">
                <div className="pi-rule-icon warning"><AlertTriangle size={14} /></div>
                <div>
                  <strong>Tidak Bisa Mengulang</strong>
                  <p>Jawaban terkirim bersifat final.</p>
                </div>
              </li>
              <li className="pi-rule-item">
                <div className="pi-rule-icon info"><ShieldAlert size={14} /></div>
                <div>
                  <strong>Gunakan Tombol Ragu</strong>
                  <p>Tandai soal yang ingin diperiksa ulang.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="nv-footer">
            <button type="button" className="nv-btn" onClick={handleStart}>
              Mulai Mengerjakan
            </button>
          </div>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default PretestIntroPage;
