import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  ArrowLeft,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  Info,
  ChevronLeft
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './DetailSkorPage.css';

function DetailSkorPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('post-test'); // 'post-test' or 'pre-test'
  const navigate = useNavigate();

  // Data mock based on the active tab
  const data = {
    'post-test': {
      benar: 21,
      salah: 4,
      score: 85,
      selectedAnswer: 'B',
      isCorrect: true,
      navGrid: [
        'benar','benar','benar','benar','salah',
        'benar','benar','benar','benar','salah',
        'benar','benar','benar','benar','salah',
        'benar','benar','benar','benar','salah',
        'benar','benar','salah','benar','benar'
      ]
    },
    'pre-test': {
      benar: 15,
      salah: 10,
      score: 60,
      selectedAnswer: 'A',
      isCorrect: false,
      navGrid: [
        'salah','benar','benar','benar','salah',
        'benar','salah','benar','salah','benar',
        'benar','benar','salah','benar','salah',
        'benar','salah','benar','salah','benar',
        'salah','salah','benar','benar','benar'
      ]
    }
  };

  const currentData = data[activeTab];

  return (
    <div className={`detail-skor-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="detail-skor-main">
        {/* Top Bar */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="topbar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu />
            </button>
            <div className="topbar-breadcrumb">
              <span className="breadcrumb-root">Dashboard</span>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <Link to="/hasil-skor" className="breadcrumb-root">Hasil Skor</Link>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <span className="breadcrumb-root">Detail</span>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <span className="breadcrumb-current">Rincian & Analisis Jawaban</span>
            </div>
          </div>
          <div className="topbar-right">
            <button className="topbar-notification">
              <Bell />
              <span className="notification-badge"></span>
            </button>
            <div className="topbar-profile">
              <div className="profile-avatar">A</div>
              <div className="profile-info">
                <span className="profile-name">Admin BMKG</span>
                <span className="profile-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="detail-skor-content">
          
          {/* Back Button & Actions */}
          <div className="ds-top-actions">
            <button className="btn-back" onClick={() => navigate('/hasil-skor')}>
              <ArrowLeft size={16} />
              Kembali ke Hasil Skor
            </button>
            <div className="ds-action-buttons">
              <button className="btn-export-excel">
                <Download size={14} /> Ekspor (.xlsx)
              </button>
              <button className="btn-print-pdf">
                <Printer size={14} /> Cetak PDF
              </button>
            </div>
          </div>

          {/* Header Title */}
          <div className="ds-header-title">
            <h1>Rincian & Analisis Jawaban Siswa</h1>
            <p>Analisis mendalam penguasaan konsep awal siswa sebelum pelaksanaan modul literasi iklim.</p>
          </div>

          {/* Student Info Card */}
          <div className="ds-student-card">
            <div className="ds-student-info">
              <h2 className="ds-student-name">Alya Putri</h2>
              <p className="ds-student-hp">No Hp: 1234567890</p>
              <div className="ds-student-badges">
                <span className="badge-sekolah">SMKN 1</span>
                <span className="badge-kelas-outline">Kelas XII RPL 1</span>
              </div>
            </div>

            <div className="ds-score-boxes">
              <div className="ds-score-box">
                <div className="box-header">
                  <span className="box-label">SKOR PRE-TEST</span>
                  <span className="box-tag gray">Awal</span>
                </div>
                <div className="box-score">
                  <strong>60</strong> <span>/ 100 Poin</span>
                </div>
                <div className="box-stats">
                  <span className="stat-benar">15 Benar</span>
                  <span className="stat-sep">-</span>
                  <span className="stat-salah">10 Salah</span>
                </div>
              </div>

              <div className="ds-score-box">
                <div className="box-header">
                  <span className="box-label">SKOR POST-TEST</span>
                  <span className="box-tag blue">Akhir</span>
                </div>
                <div className="box-score">
                  <strong className="text-blue">85</strong> <span>/ 100 Poin</span>
                </div>
                <div className="box-stats">
                  <span className="stat-benar">21 Benar</span>
                  <span className="stat-sep">-</span>
                  <span className="stat-salah">4 Salah</span>
                </div>
              </div>

              <div className="ds-score-box peningkatan">
                <div className="box-header">
                  <span className="box-label">PENINGKATAN</span>
                </div>
                <div className="box-score-large green">
                  +25
                </div>
              </div>
            </div>
          </div>

          {/* Tabs and Filters */}
          <div className="ds-tabs-row">
            <div className="ds-tabs">
              <button 
                className={`ds-tab-btn ${activeTab === 'post-test' ? 'active' : ''}`}
                onClick={() => setActiveTab('post-test')}
              >
                Post-Test (85 Poin - 21/25)
              </button>
              <button 
                className={`ds-tab-btn ${activeTab === 'pre-test' ? 'active' : ''}`}
                onClick={() => setActiveTab('pre-test')}
              >
                Pre-Test (60 Poin - 15/25)
              </button>
            </div>
            <div className="ds-filters">
              <span className="filter-label">FILTER SOAL:</span>
              <button className="filter-btn dark">Semua (25)</button>
              <button className="filter-btn green-outline">Benar ({currentData.benar})</button>
              <button className="filter-btn red-outline">Salah ({currentData.salah})</button>
              {activeTab === 'post-test' && <button className="filter-btn gray-outline">Ragu (0)</button>}
            </div>
          </div>

          {/* Main Area */}
          <div className="ds-main-grid">
            
            {/* Left Column (Question Detail) */}
            <div className="ds-question-area">
              <h3 className="question-text">
                Fenomena anomali kenaikan suhu permukaan laut (SST) di wilayah Samudera Pasifik bagian tengah dan timur yang kerap memicu berkurangnya curah hujan dan potensi kekeringan signifikan di wilayah Indonesia dikenal dengan sebutan...
              </h3>

              <div className="options-list">
                {/* Option A */}
                <div className={`option-item ${activeTab === 'pre-test' ? 'wrong-selected' : ''}`}>
                  <div className="option-label">A</div>
                  <span className="option-text">La Niña</span>
                  {activeTab === 'pre-test' && (
                    <div className="option-badge wrong">
                      <XCircle size={14} /> Pilihan Siswa (Tidak Tepat)
                    </div>
                  )}
                </div>

                {/* Option B */}
                <div className={`option-item ${activeTab === 'post-test' ? 'correct-selected' : 'correct-outline'}`}>
                  <div className="option-label">B</div>
                  <span className="option-text">El Niño</span>
                  {activeTab === 'post-test' ? (
                    <div className="option-badge correct">
                      Jawaban Siswa & Kunci <CheckCircle2 size={14} />
                    </div>
                  ) : (
                    <div className="option-badge correct-text">
                      <CheckCircle2 size={14} /> Kunci Jawaban Benar
                    </div>
                  )}
                </div>

                {/* Option C */}
                <div className="option-item">
                  <div className="option-label">C</div>
                  <span className="option-text">Indian Ocean Dipole (IOD) Positif</span>
                </div>

                {/* Option D */}
                <div className="option-item">
                  <div className="option-label">D</div>
                  <span className="option-text">Madden-Julian Oscillation (MJO)</span>
                </div>

                {/* Option E */}
                <div className="option-item">
                  <div className="option-label">E</div>
                  <span className="option-text">Gelombang Kelvin</span>
                </div>
              </div>

              <div className="pembahasan-box">
                <div className="pembahasan-header">
                  <Info size={16} /> Pembahasan Kunci Jawaban:
                </div>
                <p>El Niño adalah fenomena pemanasan suhu muka laut di atas rata-rata di kawasan Pasifik khatulistiwa bagian tengah dan timur. Kondisi ini menyebabkan sirkulasi konveksi bergeser ke timur sehingga pembentukan awan hujan di kawasan Indonesia berkurang tajam.</p>
              </div>

              <div className="question-nav-bottom">
                <button className="btn-nav-outline">
                  <ChevronLeft size={16} /> Soal Sebelumnya
                </button>
                <span className="nav-info">Menampilkan butir 1 - 25</span>
                <button className="btn-nav-solid">
                  Soal Selanjutnya <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Column (Navigation Grid) */}
            <div className="ds-nav-area">
              <div className="nav-header">
                <div className="nav-title">
                  <Menu size={16} /> NAVIGASI NOMOR SOAL
                </div>
                <span className="nav-count">25 Butir</span>
              </div>
              
              <div className="nav-legend">
                <div className="legend-item">
                  <div className="legend-dot green"></div> Benar ({currentData.benar})
                </div>
                <div className="legend-item">
                  <div className="legend-dot red"></div> Salah ({currentData.salah})
                </div>
              </div>

              <div className="nav-grid">
                {currentData.navGrid.map((status, index) => {
                  const num = index + 1;
                  let className = 'nav-cell';
                  if (status === 'benar') {
                    if (num === 1) className += ' active-benar';
                    else className += ' outline-benar';
                  } else {
                    if (num === 1 && status === 'salah') className += ' active-salah'; // If active was wrong
                    else className += ' solid-salah';
                  }

                  return (
                    <button key={num} className={className}>
                      {num.toString().padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              <div className="nav-info-box">
                <Info size={16} className="info-icon-blue" />
                <p>Klik pada salah satu nomor soal di atas untuk langsung membuka detail butir soal dan penjelasan kunci jawabannya.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default DetailSkorPage;
