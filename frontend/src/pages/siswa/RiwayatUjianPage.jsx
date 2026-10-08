import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  History, 
  CheckCircle2, 
  Clock, 
  FileText,
  AlertCircle 
} from 'lucide-react';
import './RiwayatUjianPage.css';

function RiwayatUjianPage() {
  const navigate = useNavigate();
  const [riwayat, setRiwayat] = useState([]);

  useEffect(() => {
    // Simulasi ambil data riwayat dari localStorage atau API
    const pretestScore = localStorage.getItem('skorPretest');
    const posttestScore = localStorage.getItem('skorPosttest');
    
    const data = [];
    
    if (pretestScore !== null) {
      data.push({
        id: 1,
        jenis: 'Pre-Test',
        modul: 'Mitigasi & Adaptasi Perubahan Iklim',
        tanggal: '12 Okt 2026, 08:30',
        skor: parseInt(pretestScore),
        status: 'Selesai'
      });
    }

    if (posttestScore !== null) {
      data.push({
        id: 2,
        jenis: 'Post-Test',
        modul: 'Mitigasi & Adaptasi Perubahan Iklim',
        tanggal: '15 Okt 2026, 10:15',
        skor: parseInt(posttestScore),
        status: 'Selesai'
      });
    }
    
    setRiwayat(data.reverse()); // Urutkan dari yang terbaru
  }, []);

  return (
    <div className="siswa-layout">
      {/* Header Mobile */}
      <header className="mobile-header">
        <button className="btn-back" onClick={() => navigate('/siswa/dashboard')}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="header-title">Riwayat Ujian</h1>
        <div style={{ width: 24 }}></div>
      </header>

      {/* Main Content */}
      <main className="siswa-main-content has-header">
        <div className="riwayat-container">
          <div className="riwayat-header-info">
            <div className="icon-wrapper bg-green-light">
              <History className="text-green" size={24} />
            </div>
            <div>
              <h2 className="section-title">Aktivitas Evaluasi Anda</h2>
              <p className="section-subtitle">Daftar lengkap ujian dan kuis yang telah Anda kerjakan beserta nilai yang diperoleh.</p>
            </div>
          </div>

          <div className="riwayat-list">
            {riwayat.length === 0 ? (
              <div className="empty-state">
                <AlertCircle size={48} className="text-gray-300" />
                <h3>Belum Ada Riwayat</h3>
                <p>Anda belum mengerjakan ujian apapun. Silakan mulai mengerjakan pre-test di halaman Dashboard.</p>
                <button 
                  className="btn-primary mt-4" 
                  onClick={() => navigate('/siswa/dashboard')}
                >
                  Ke Beranda
                </button>
              </div>
            ) : (
              riwayat.map((item) => (
                <div key={item.id} className="riwayat-card">
                  <div className="riwayat-card-header">
                    <div className="riwayat-badge">{item.jenis}</div>
                    <div className="riwayat-date">
                      <Clock size={14} />
                      {item.tanggal}
                    </div>
                  </div>
                  <h3 className="riwayat-module-title">
                    <FileText size={16} />
                    {item.modul}
                  </h3>
                  
                  <div className="riwayat-card-footer">
                    <div className="riwayat-status">
                      <CheckCircle2 size={16} className="text-green" />
                      <span>{item.status}</span>
                    </div>
                    <div className="riwayat-score">
                      <span className="score-label">Nilai:</span>
                      <span className={`score-value ${item.skor >= 70 ? 'good' : 'bad'}`}>
                        {item.skor}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default RiwayatUjianPage;
