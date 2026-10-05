import { ChevronLeft, GraduationCap, Battery, Wifi, Signal, Download, Book, ArrowRight, NotebookPen, FileText } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

function ModulSiswaPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('pretestDone') !== 'true') {
      navigate('/siswa/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="mobile-app-container">
      <div className="mobile-screen">
        <div className="status-bar">
          <span className="time">09.41</span>
          <div className="status-icons">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={16} />
          </div>
        </div>

        <header className="mobile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <div className="app-title">
            <div className="app-logo-bg">
              <GraduationCap size={16} color="#000" />
            </div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="badge-portal">
            <div className="dot"></div>
            Portal Siswa
          </div>
        </header>

        <div className="progress-section">
          <div className="progress-text">
            <span className="step-count">Langkah 1 dari 4</span>
            <span className="step-name">Modul Pembelajaran</span>
          </div>
          <div className="progress-bars">
            <div className="bar active"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>

        <div className="form-content" style={{ padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#1e3a8a', color: 'white', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              <Book size={14} />
              Modul 1
            </div>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>10 Menit Waktu Baca</span>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0', lineHeight: 1.2 }}>Pengenalan Materi</h1>
          <p style={{ fontSize: 14, color: '#475569', margin: '0 0 20px 0', lineHeight: 1.5 }}>
            Pelajari konsep dasar dan pengenalan materi sebelum melanjutkan ke pembahasan berikutnya.
          </p>

          <div style={{ width: '100%', height: 160, backgroundColor: '#e2e8f0', borderRadius: 16, marginBottom: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Modul cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: 16, border: '1px dashed #bae6fd', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, backgroundColor: '#e0f2fe', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0284c7' }}>
                <FileText size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Salinan Digital Tersedia</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Simpan materi agar bisa dibaca offline</div>
              </div>
            </div>
            <button style={{ padding: '8px 16px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: 12, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} /> Unduh
            </button>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 4, height: 16, backgroundColor: '#0ea5e9', borderRadius: 4 }}></div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Pengantar</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              Materi ini membahas konsep-konsep dasar yang perlu dipahami sebelum mempelajari pembahasan lebih lanjut. Pelajari setiap bagian secara berurutan agar kamu dapat memahami materi dengan lebih mudah.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 24 }}>
              <div style={{ width: 4, height: 16, backgroundColor: '#0ea5e9', borderRadius: 4 }}></div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Materi</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              Pemahaman awal terhadap materi akan membimbing untuk menguasai konsep-konsep kunci secara terstruktur. Setiap topik dirancang saling berkaitan sehingga mempermudah proses belajar.
            </p>

            <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #3b82f6', padding: '16px', borderRadius: '0 12px 12px 0', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#1d4ed8', fontWeight: 700, fontSize: 13 }}>
                <NotebookPen size={16} /> Catatan Penting
              </div>
              <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>
                Perhatikan konsep, definisi, istilah penting, serta catatan rangkuman yang disajikan agar kamu dapat mempersiapkan diri secara optimal saat evaluasi post-test nanti.
              </p>
            </div>
            
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              Setelah selesai membaca materi ini, pastikan kamu telah memahami poin-poin utama sebelum melangkah ke tahapan uji kompetensi berikutnya.
            </p>
          </div>

          <div className="submit-section" style={{ marginTop: 20, paddingBottom: 24 }}>
            <button className="submit-btn" onClick={() => navigate('/siswa/posttest-intro')}>
              Lanjutkan ke Tahap Berikutnya
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>
      </div>
    </div>
  );
}

export default ModulSiswaPage;
