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

const API_BASE_URL = 'http://localhost:8000/api';

function DetailSkorPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('post-test');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get('student_id');
  
  const [studentDetails, setStudentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default empty structure
  const [data, setData] = useState({
    'pre-test': { benar: 0, salah: 0, score: 0, navGrid: [], answers: [] },
    'post-test': { benar: 0, salah: 0, score: 0, navGrid: [], answers: [] }
  });

  useEffect(() => {
    if (!studentId) return;
    
    setIsLoading(true);
    fetch(`${API_BASE_URL}/detail_skor.php?student_id=${studentId}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setStudentDetails(result.data.student);
          setData({
            'pre-test': result.data['pre-test'],
            'post-test': result.data['post-test']
          });
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [studentId]);

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
                  <h2 className="ds-student-name">{studentDetails?.nama || 'Data Siswa'}</h2>
                  <p className="ds-student-hp">No Hp: {studentDetails?.no_hp || '-'}</p>
                  <div className="ds-student-badges">
                    <span className="badge-sekolah">{studentDetails?.sekolah || '-'}</span>
                    <span className="badge-kelas-outline">Kelas {studentDetails?.kelas || '-'}</span>
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
                      {data['post-test'].score - data['pre-test'].score > 0 ? '+' : ''}{data['post-test'].score - data['pre-test'].score}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="ds-tabs-row" style={{ marginTop: '2rem' }}>
                <div className="ds-tabs">
                  <button 
                    className={`ds-tab-btn ${activeTab === 'pre-test' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pre-test')}
                  >
                    Pre-Test
                  </button>
                  <button 
                    className={`ds-tab-btn ${activeTab === 'post-test' ? 'active' : ''}`}
                    onClick={() => setActiveTab('post-test')}
                  >
                    Post-Test
                  </button>
                </div>
              </div>

              {/* Main Area */}
              <div className="ds-answers-container" style={{ marginTop: '1.5rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {currentData.answers && currentData.answers.length > 0 ? (
                  <div className="ds-answers-list" style={{ padding: '2rem' }}>
                    {currentData.answers.map((ans, idx) => (
                      <div key={idx} className="ds-answer-item" style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>Soal No. {ans.no}</span>
                          {ans.isCorrect ? (
                            <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={16} /> Benar</span>
                          ) : (
                            <span style={{ color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={16} /> Salah</span>
                          )}
                        </div>
                        <p style={{ color: '#475569', marginBottom: '1rem', lineHeight: '1.5' }}>{ans.question}</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div style={{ padding: '0.75rem', borderRadius: '8px', background: ans.isCorrect ? '#ecfdf5' : '#fef2f2', border: `1px solid ${ans.isCorrect ? '#a7f3d0' : '#fecaca'}` }}>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Jawaban Siswa ({ans.selected})</div>
                            <div style={{ color: '#334155', fontWeight: 500 }}>{ans.options[ans.selected] || '-'}</div>
                          </div>
                          
                          {!ans.isCorrect && (
                            <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Kunci Jawaban ({ans.correct})</div>
                              <div style={{ color: '#334155', fontWeight: 500 }}>{ans.options[ans.correct] || '-'}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                    <Info size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
                    <p style={{ color: '#64748b' }}>Riwayat jawaban butir soal per siswa belum tersedia. Fitur detail jawaban akan aktif setelah siswa mulai mengisi tes secara realtime.</p>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default DetailSkorPage;
