import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

const API_BASE_URL = 'http://localhost/WEB_BMKG/Web-BMKG/backend/api';

function DetailSkorPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('post-test');
  const navigate = useNavigate();
  const location = useLocation();
  
  const [studentDetails, setStudentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default empty structure
  const [data, setData] = useState({
    'pre-test': { benar: 0, salah: 0, score: 0, navGrid: [], answers: [] },
    'post-test': { benar: 0, salah: 0, score: 0, navGrid: [], answers: [] }
  });

  useEffect(() => {
    // Simulasi pengambilan data analisis (karena URL ID parameter belum diterapkan secara utuh di halaman utama)
    // Di aplikasi nyata, gunakan endpoint API: fetch(`${API_BASE_URL}/detail_skor.php?student_id=${studentId}`)
    setIsLoading(true);
    setTimeout(() => {
      // Mocked empty data to remove the hardcoded fake arrays 
      // (This will simply show 0/0 and no questions if DB is empty)
      setData({
        'pre-test': { benar: 0, salah: 0, score: 0, navGrid: [], answers: [] },
        'post-test': { benar: 0, salah: 0, score: 0, navGrid: [], answers: [] }
      });
      setIsLoading(false);
    }, 500);
  }, [location.search]);

  const currentData = data[activeTab] || data['post-test'];

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
          
          <div className="ds-top-actions">
            <button className="btn-back" onClick={() => navigate('/hasil-skor')}>
              <ArrowLeft size={16} />
              Kembali ke Hasil Skor
            </button>
          </div>

          <div className="ds-header-title">
            <h1>Rincian & Analisis Jawaban Siswa</h1>
            <p>Analisis mendalam penguasaan konsep awal siswa sebelum pelaksanaan modul literasi iklim.</p>
          </div>

          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Memuat data riwayat tes siswa dari database...
            </div>
          ) : (
            <>
              {/* Student Info Card */}
              <div className="ds-student-card">
                <div className="ds-student-info">
                  <h2 className="ds-student-name">Data Siswa</h2>
                  <p className="ds-student-hp">No Hp: -</p>
                  <div className="ds-student-badges">
                    <span className="badge-sekolah">-</span>
                    <span className="badge-kelas-outline">Kelas -</span>
                  </div>
                </div>

                <div className="ds-score-boxes">
                  <div className="ds-score-box">
                    <div className="box-header">
                      <span className="box-label">SKOR PRE-TEST</span>
                      <span className="box-tag gray">Awal</span>
                    </div>
                    <div className="box-score">
                      <strong>{data['pre-test'].score}</strong> <span>/ 100 Poin</span>
                    </div>
                  </div>

                  <div className="ds-score-box">
                    <div className="box-header">
                      <span className="box-label">SKOR POST-TEST</span>
                      <span className="box-tag blue">Akhir</span>
                    </div>
                    <div className="box-score">
                      <strong className="text-blue">{data['post-test'].score}</strong> <span>/ 100 Poin</span>
                    </div>
                  </div>

                  <div className="ds-score-box peningkatan">
                    <div className="box-header">
                      <span className="box-label">PENINGKATAN</span>
                    </div>
                    <div className="box-score-large gray">
                      0
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Area */}
              <div style={{ marginTop: '2rem', padding: '2rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <p style={{ color: '#64748b' }}>Riwayat jawaban butir soal per siswa belum tersedia. Fitur detail jawaban akan aktif setelah siswa mulai mengisi pre-test secara realtime.</p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default DetailSkorPage;
