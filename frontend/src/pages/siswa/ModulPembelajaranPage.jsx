import { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, BookOpen, BookOpenText, CircleCheck, Download, Lightbulb, MonitorSmartphone, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imgCover from '../../assets/modul-cover.jpg';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './ModulPembelajaranPage.css';

const API_BASE_URL = 'http://localhost:8000/api';
const FOKUS_PEMBAHASAN = ['Konsep Dasar', 'Struktur Topik', 'Persiapan Uji Kompetensi'];

function ModulPembelajaranPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [modulData, setModulData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('pretestDone') !== 'true') {
      navigate('/siswa/dashboard', { replace: true });
      return;
    }

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);

    const fetchModul = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/modules.php`);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          // Get the first active module
          const activeModul = result.data.find(m => m.is_active === 1) || result.data[0];
          setModulData(activeModul);
        }
      } catch (error) {
        console.error('Failed to fetch module', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModul();

    return () => clearInterval(t);
  }, [navigate]);

  const handleSelesai = () => {
    localStorage.setItem('modulDone', 'true');

    // Simpan juga ke registry (per nomor telepon) agar progres tidak hilang setelah keluar & masuk lagi
    const phone = localStorage.getItem('siswaPhone') || '';
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    if (users[phone]) {
      users[phone].modulDone = true;
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    }

    navigate('/siswa/dashboard');
  };

  return (
    <div className="m-app">
      <div className="m-screen nv-page modul-page">
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
          <button type="button" className="nv-back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
            <ChevronLeft size={18} />
          </button>
          <div className="m-app-title">
            <div className="nv-logo"><GraduationCap size={16} strokeWidth={2} /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="nv-badge"><div className="nv-badge-dot"></div> Portal Siswa</div>
        </header>

        <div className="m-body nv-body modul-body">
          {loading ? (
             <div style={{ padding: '20px', textAlign: 'center' }}>Memuat modul...</div>
          ) : !modulData ? (
             <div style={{ padding: '20px', textAlign: 'center' }}>Modul belum tersedia.</div>
          ) : (
            <>
          {/* Judul modul */}
          <section className="modul-card modul-hero">
            <div className="modul-hero-top">
              <span className="modul-badge"><BookOpenText size={15} /> Modul Pembelajaran</span>
              <span className="modul-offline"><CircleCheck size={13} /> {modulData.kategori}</span>
            </div>
            <h1 className="modul-judul">{modulData.judul}</h1>
            <p className="modul-subtitle">{modulData.deskripsi || "Pelajari konsep dasar dan pengenalan materi sebelum melanjutkan ke pembahasan berikutnya."}</p>
            <div className="modul-cover">
              <img src={imgCover} alt="Buku catatan terbuka di atas meja belajar" />
              <span className="modul-cover-caption"><BookOpen size={15} /> Bahan Bacaan Pokok Siswa</span>
            </div>
          </section>

          {/* Isi materi */}
          <article className="modul-card modul-materi">
            <h2 className="modul-section-heading">Pengantar</h2>
            <p>
              Materi ini membahas konsep dasar yang perlu dipahami sebelum mempelajari pembahasan lebih lanjut.
            </p>
            <p>
              Pelajari setiap bagian secara berurutan agar kamu dapat memahami materi dengan lebih mudah.
            </p>

            <hr className="modul-divider" />

            <h2 className="modul-section-heading">Materi</h2>
            <p>
              Pemahaman awal terhadap materi ini akan membimbing untuk menguasai konsep-konsep kunci secara
              terstruktur. Setiap topik dirancang saling berkaitan sehingga mempermudah proses belajar.
            </p>

            <div className="modul-note">
              <Lightbulb size={18} className="modul-note-icon" />
              <div>
                <p className="modul-note-title">Catatan Penting</p>
                <p className="modul-note-text">
                  Perhatikan ilustrasi konsep, definisi istilah penting, serta catatan rangkuman yang disajikan
                  agar kamu dapat mempersiapkan diri secara optimal saat evaluasi post-test nanti.
                </p>
              </div>
            </div>

            <p>
              Setelah selesai membaca materi ini, pastikan kamu telah memahami poin-poin utama sebelum
              melanjutkan ke tahapan uji kompetensi berikutnya.
            </p>

            <p className="modul-focus-label">Fokus Pembahasan</p>
            <ul className="modul-chips">
              {FOKUS_PEMBAHASAN.map((f) => (
                <li key={f} className="modul-chip"><CircleCheck size={14} /> {f}</li>
              ))}
            </ul>
          </article>

          {/* Simpan modul */}
          <section className="modul-card modul-save">
            <div className="modul-icon-tile"><MonitorSmartphone size={22} /></div>
            <h2 className="modul-save-title">Baca & Unduh Modul Pembelajaran</h2>
            <p className="modul-save-desc">Modul ini dapat dibaca langsung atau disimpan ke perangkat untuk dibaca secara luring.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              {modulData.file_path ? (
                <>
                  <button type="button" className="nv-btn" onClick={() => window.open(`http://localhost:8000/${modulData.file_path}`, '_blank')}>
                    <BookOpen size={18} /> Buka PDF
                  </button>
                  <a href={`http://localhost:8000/${modulData.file_path}`} download className="nv-btn" style={{ textDecoration: 'none', background: '#3b82f6', color: 'white' }}>
                    <Download size={18} /> Download Modul
                  </a>
                </>
              ) : (
                <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>File modul PDF belum diunggah oleh Admin.</p>
              )}
            </div>
          </section>
            </>
          )}
        </div>

        {/* Tombol selesai (menempel di bawah) */}
        <div className="modul-sticky-footer">
          <button type="button" className="modul-finish-btn" onClick={() => setShowConfirm(true)}>
            <span className="modul-finish-check"><Check size={17} strokeWidth={3} /></span>
            Selesai Membaca <ArrowRight size={18} />
          </button>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>

        {/* Konfirmasi selesai membaca */}
        {showConfirm && (
          <div className="m-overlay" onClick={() => setShowConfirm(false)}>
            <div
              className="m-modal nv-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modul-confirm-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nv-dialog-icon"><CircleCheck size={22} /></div>
              <h3 id="modul-confirm-title">Sudah selesai membaca?</h3>
              <p>Pastikan kamu sudah memahami seluruh materi. Setelah ini, <strong>Posttest</strong> akan terbuka di Dashboard.</p>
              <div className="nv-dialog-actions">
                <button type="button" className="nv-btn secondary" onClick={() => setShowConfirm(false)}>Baca Lagi</button>
                <button type="button" className="nv-btn" onClick={handleSelesai}>Ya, Selesai</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModulPembelajaranPage;
