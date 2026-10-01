import { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, BookOpen, BookOpenText, CircleCheck, Download, Lightbulb, MonitorSmartphone, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imgCover from '../../assets/modul-cover.jpg';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './ModulPembelajaranPage.css';

const FOKUS_PEMBAHASAN = ['Iklim & Cuaca', 'Efek Rumah Kaca', 'Dampak & Mitigasi'];

function ModulPembelajaranPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

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
          <div className="nv-badge"><div className="nv-badge-dot"></div> Modul</div>
        </header>

        <div className="m-body nv-body modul-body">
          {/* Judul modul */}
          <section className="modul-card modul-hero">
            <div className="modul-hero-top">
              <span className="modul-badge"><BookOpenText size={15} /> Modul 1</span>
              <span className="modul-offline"><CircleCheck size={13} /> Tersedia Luring</span>
            </div>
            <h1 className="modul-judul">Pengenalan Iklim &amp; Cuaca</h1>
            <p className="modul-subtitle">Pelajari konsep dasar iklim dan cuaca beserta fenomena perubahannya.</p>
            <div className="modul-cover">
              <img src={imgCover} alt="Buku catatan terbuka di atas meja belajar" />
              <span className="modul-cover-caption"><BookOpen size={15} /> Bahan Bacaan Pokok Siswa</span>
            </div>
          </section>

          {/* Salinan digital */}
          <section className="modul-download">
            <div className="modul-icon-tile"><Download size={18} /></div>
            <div className="modul-download-text">
              <p className="modul-download-title">Salinan Digital Tersedia</p>
              <p className="modul-download-desc">Akses kapan saja tanpa koneksi internet</p>
            </div>
            <button type="button" className="modul-download-btn">
              <Download size={15} /> Unduh
            </button>
          </section>

          {/* Isi materi */}
          <article className="modul-card modul-materi">
            <h2 className="modul-section-heading">Pengantar</h2>
            <p>
              Iklim dan cuaca merupakan dua konsep yang saling berhubungan tetapi memiliki perbedaan fundamental.
              <strong> Cuaca</strong> merujuk pada kondisi atmosfer dalam jangka pendek, sedangkan <strong>iklim</strong> mencakup
              rata-rata pola cuaca selama periode waktu yang panjang (biasanya 30 tahun atau lebih).
            </p>

            <hr className="modul-divider" />

            <h2 className="modul-section-heading">Materi</h2>
            <p>
              Perubahan iklim global disebabkan oleh peningkatan konsentrasi gas rumah kaca di atmosfer,
              terutama karbon dioksida (CO₂) dan metana (CH₄). Aktivitas manusia seperti pembakaran bahan
              bakar fosil dan deforestasi mempercepat proses ini secara signifikan.
            </p>
            <p>
              Dampak perubahan iklim meliputi kenaikan permukaan laut, peningkatan frekuensi bencana alam,
              dan perubahan pola curah hujan. BMKG berperan penting dalam monitoring dan prediksi perubahan
              iklim di Indonesia melalui stasiun-stasiun observasi yang tersebar di seluruh nusantara.
            </p>

            <div className="modul-note">
              <Lightbulb size={18} className="modul-note-icon" />
              <div>
                <p className="modul-note-title">Catatan Penting</p>
                <p className="modul-note-text">
                  Perhatikan konsep efek rumah kaca, perbedaan iklim dan cuaca, serta dampak pemanasan global
                  agar kamu dapat mempersiapkan diri secara optimal saat evaluasi posttest nanti.
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
            <h2 className="modul-save-title">Simpan Modul Pembelajaran</h2>
            <p className="modul-save-desc">Modul ini dapat disimpan ke perangkat untuk dibaca secara luring.</p>
            <button type="button" className="nv-btn">
              <Download size={18} /> Download Modul
            </button>
          </section>
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
