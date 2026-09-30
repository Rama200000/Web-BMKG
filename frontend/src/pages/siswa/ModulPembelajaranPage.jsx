import { useState, useEffect } from 'react';
import { ChevronLeft, Leaf, Book, Download, FileText, NotebookPen, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './mobile-green-theme.css';
import './ModulPembelajaranPage.css';

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
    navigate('/siswa/dashboard');
  };

  return (
    <div className="m-app">
      <div className="m-screen">
        <div className="m-statusbar">
          <span>{currentTime}</span>
          <div className="m-statusbar-icons">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="10" x2="23" y2="14"/></svg>
          </div>
        </div>

        <header className="m-header">
          <button className="m-back-btn" onClick={() => navigate(-1)}><ChevronLeft size={18} /></button>
          <div className="m-app-title">
            <div className="m-app-logo"><Leaf size={16} color="#059669" /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="m-badge"><div className="m-badge-dot"></div> Modul</div>
        </header>

        <div className="m-body modul-body">
          {/* Module Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="modul-badge">
              <Book size={14} />
              <span>Modul 1</span>
            </div>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>⏱ 10 Menit Baca</span>
          </div>

          <h1 className="m-title" style={{ fontSize: 22 }}>Pengenalan Iklim & Cuaca</h1>
          <p className="m-subtitle">Pelajari konsep dasar iklim dan cuaca beserta fenomena perubahannya.</p>

          {/* Image */}
          <div className="modul-cover">
            <div className="modul-cover-placeholder">
              <Leaf size={40} strokeWidth={1.2} />
              <span>Ilustrasi Modul</span>
            </div>
          </div>

          {/* Download */}
          <div className="modul-download-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div className="m-icon-circle green"><FileText size={18} /></div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', margin: 0 }}>Salinan Digital</p>
                <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>PDF • Bisa dibaca offline</p>
              </div>
            </div>
            <button className="modul-download-btn">
              <Download size={14} /> Unduh
            </button>
          </div>

          {/* Content */}
          <div className="modul-content">
            <div className="modul-section-heading">
              <div className="modul-section-bar"></div>
              <h2>Pengantar</h2>
            </div>
            <p>
              Iklim dan cuaca merupakan dua konsep yang saling berhubungan tetapi memiliki perbedaan fundamental.
              <strong> Cuaca</strong> merujuk pada kondisi atmosfer dalam jangka pendek, sedangkan <strong>iklim</strong>
              mencakup rata-rata pola cuaca selama periode waktu yang panjang (biasanya 30 tahun atau lebih).
            </p>

            <div className="modul-section-heading" style={{ marginTop: 24 }}>
              <div className="modul-section-bar"></div>
              <h2>Perubahan Iklim</h2>
            </div>
            <p>
              Perubahan iklim global disebabkan oleh peningkatan konsentrasi gas rumah kaca di atmosfer,
              terutama karbon dioksida (CO₂) dan metana (CH₄). Aktivitas manusia seperti pembakaran bahan
              bakar fosil dan deforestasi mempercepat proses ini secara signifikan.
            </p>

            {/* Note */}
            <div className="modul-note">
              <div className="modul-note-header">
                <NotebookPen size={16} />
                <span>Catatan Penting</span>
              </div>
              <p>
                Perhatikan konsep efek rumah kaca, perbedaan iklim dan cuaca, serta dampak pemanasan global
                — topik ini akan diujikan dalam Posttest nanti.
              </p>
            </div>

            <div className="modul-section-heading" style={{ marginTop: 24 }}>
              <div className="modul-section-bar"></div>
              <h2>Dampak & Mitigasi</h2>
            </div>
            <p>
              Dampak perubahan iklim meliputi kenaikan permukaan laut, peningkatan frekuensi bencana alam,
              dan perubahan pola curah hujan. BMKG berperan penting dalam monitoring dan prediksi perubahan
              iklim di Indonesia melalui stasiun-stasiun observasi yang tersebar di seluruh nusantara.
            </p>
          </div>
        </div>

        {/* Sticky Finish Button */}
        <div className="modul-sticky-footer">
          <button className="m-btn-primary" onClick={() => setShowConfirm(true)}>
            <CheckCircle2 size={18} />
            Selesai Membaca
          </button>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="m-overlay">
            <div className="m-modal">
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ECFDF5', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={28} color="#059669" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', margin: '0 0 8px 0' }}>Sudah Selesai Membaca?</h3>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 20px 0', lineHeight: 1.6 }}>
                Pastikan kamu sudah memahami seluruh materi. Setelah ini, <strong>Posttest</strong> akan terbuka di Dashboard.
              </p>
              <button className="m-btn-primary" onClick={handleSelesai}>
                Ya, Saya Sudah Selesai
                <ArrowRight size={17} />
              </button>
              <button className="m-btn-outline" style={{ marginTop: 10 }} onClick={() => setShowConfirm(false)}>
                Baca Lagi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModulPembelajaranPage;
