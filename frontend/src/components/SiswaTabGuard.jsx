import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function SiswaTabGuard({ children }) {
  const location = useLocation();
  const [showWarning, setShowWarning] = useState(false);
  const lastViolationTimeRef = useRef(0);

  // Rute siswa yang dipantau (Home/Dashboard, Pretest, Modul, Posttest, Hasil, Peringkat)
  const isGuardedRoute = [
    '/siswa/dashboard',
    '/siswa/pretest-info',
    '/siswa/posttest-info',
    '/siswa/ujian',
    '/siswa/hasil-pretest',
    '/siswa/pretest-selesai',
    '/siswa/modul',
    '/siswa/hasil-posttest',
    '/siswa/posttest-selesai',
    '/siswa/peringkat',
    '/siswa/riwayat',
  ].some((r) => location.pathname.startsWith(r));

  const handleViolation = useCallback(() => {
    if (!isGuardedRoute) return;

    // Cek apakah ada bypass sementara (misal: saat klik buka PDF modul pembelajaran)
    const bypassUntil = parseInt(sessionStorage.getItem('siswa_bypass_guard') || '0', 10);
    if (Date.now() < bypassUntil) {
      return;
    }

    const now = Date.now();
    // Debounce 1.5 detik agar event ganda (blur + visibilitychange) dalam satu kali pindah tidak terhitung 2 kali
    if (now - lastViolationTimeRef.current < 1500) {
      return;
    }
    lastViolationTimeRef.current = now;

    const currentCount = parseInt(sessionStorage.getItem('siswa_warn_count') || '0', 10) + 1;
    sessionStorage.setItem('siswa_warn_count', currentCount.toString());
    console.warn(`[Anti-Cheat Siswa] Pelanggaran ke-${currentCount} pada: ${location.pathname}`);

    if (currentCount >= 2) {
      // Pelanggaran ke-2: Jika sedang di halaman soal, simpan jawaban otomatis sebelum keluar
      if (location.pathname.startsWith('/siswa/ujian')) {
        window.dispatchEvent(new CustomEvent('anti-cheat-force-submit'));
      } else {
        // Pada halaman lain (home, modul, info): simpan sesi keluar dan logout ke scan barcode
        localStorage.removeItem('userRole');
        sessionStorage.removeItem('siswa_warn_count');
        window.location.replace('/siklim/siswa/scan');
      }
    } else {
      // Pelanggaran ke-1: Tampilkan modal peringatan
      setShowWarning(true);
    }
  }, [isGuardedRoute, location.pathname]);

  useEffect(() => {
    if (!isGuardedRoute) return;

    const onVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      } else {
        // Saat kembali ke tab: jika sudah kena 1 peringatan, pastikan modal tampil
        const count = parseInt(sessionStorage.getItem('siswa_warn_count') || '0', 10);
        if (count === 1) {
          setShowWarning(true);
        }
      }
    };

    const onBlur = () => {
      handleViolation();
    };

    const onFocus = () => {
      const count = parseInt(sessionStorage.getItem('siswa_warn_count') || '0', 10);
      if (count === 1) {
        setShowWarning(true);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [isGuardedRoute, handleViolation]);

  return (
    <>
      {children}

      {/* Modal Peringatan 1x Global Siswa (Home, Pretest, Modul, Posttest) */}
      {showWarning && (
        <div
          className="m-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="m-modal nv-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="guard-warn-title"
            aria-describedby="guard-warn-desc"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '380px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '28px 22px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              animation: 'm-slideUp 0.3s ease',
            }}
          >
            <div className="nv-dialog-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
              <ShieldAlert size={28} strokeWidth={2} />
            </div>
            <h3 id="guard-warn-title" style={{ color: '#DC2626', fontSize: '18px', fontWeight: 800, margin: '0 0 8px' }}>
              Peringatan Si Iklim Muda!
            </h3>
            <p id="guard-warn-desc" style={{ fontSize: '13px', lineHeight: 1.5, color: '#4B5563', margin: '0 0 10px' }}>
              Sistem mendeteksi Anda <strong>berpindah atau keluar dari tab web Si Iklim Muda</strong>.
            </p>
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '10px',
                padding: '12px 14px',
                margin: '10px 0 16px',
                fontSize: '12.5px',
                color: '#991B1B',
                textAlign: 'left',
                lineHeight: 1.5,
              }}
            >
              ⚠️ <strong>Peringatan (1/1):</strong>
              <br />
              Harap <strong>tidak keluar dari tab web Si Iklim Muda</strong> selama kegiatan pembelajaran, membaca modul, maupun pengerjaan soal.
              <br />
              Jika Anda keluar dari tab web sekali lagi, sesi Anda akan <strong>langsung dihentikan otomatis</strong> dan Anda harus scan barcode ulang untuk masuk kembali!
            </div>
            <button
              type="button"
              className="nv-btn"
              autoFocus
              onClick={() => setShowWarning(false)}
              style={{
                background: '#DC2626',
                color: '#ffffff',
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 700,
              }}
            >
              Saya Mengerti, Lanjutkan
            </button>
          </div>
        </div>
      )}
    </>
  );
}

