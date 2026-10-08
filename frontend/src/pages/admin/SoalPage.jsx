import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, ChevronRight,
  Filter,
  ArrowDownUp,
  Eye,
  Trash2,
  CheckCircle2,
  Save,
  MessageSquare,
  Lock,
  Plus,
  Pencil
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './SoalPage.css';

const API_BASE_URL = 'http://localhost:8000/api';

function SoalPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/questions.php`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus soal ini?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/questions.php?id=${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
          fetchQuestions();
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error('Error deleting:', err);
      }
    }
  };

  return (
    <div className={`soal-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="soal-main">
        {/* Top Bar */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="topbar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu />
            </button>
          </div>
          <div className="topbar-right">
            <div className="topbar-profile">
              <div className="profile-avatar" style={{ background: localStorage.getItem('userRole') === 'superadmin' ? '#7c3aed' : '#2563eb' }}>
                {localStorage.getItem('userRole') === 'superadmin' ? 'SA' : 'A'}
              </div>
              <div className="profile-info">
                <span className="profile-name">{localStorage.getItem('userRole') === 'superadmin' ? 'Super Admin' : 'Admin'}</span>
                <span className="profile-role">{localStorage.getItem('userRole') === 'superadmin' ? 'Root Access' : 'Administrator'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="soal-content">
          
          {/* Header */}
          <div className="soal-header-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div className="soal-breadcrumb">
                <span className="breadcrumb-root">Dashboard</span>
                <ChevronRight size={13} className="breadcrumb-sep" />
                <span className="breadcrumb-current">Soal</span>
              </div>
              <h1 className="soal-title">Manajemen Bank Soal</h1>
            </div>
            <Link to="/tambah-soal" className="btn-simpan" style={{ textDecoration: 'none' }}>
              <Plus size={14} /> Tambah Soal
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="soal-stats-bar">
            <div className="stat-pill">
              <div className="stat-dot blue"></div>
              <span>Total Soal:</span>
              <strong>{questions.length}</strong>
            </div>
          </div>

          {/* Main Grid */}
          <div className="soal-grid">
            
            {/* Left Column (List) */}
            <div className="soal-list-column">
              <div className="question-list-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 className="question-list-title">Daftar Pertanyaan</h3>
                  <span className="question-list-subtitle">({questions.length} Ditampilkan)</span>
                </div>
                <div className="question-list-actions">
                  {/* Empty or you can add filter buttons later */}
                </div>
              </div>

              {isLoading ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Memuat bank soal...</p>
              ) : questions.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Belum ada soal terdaftar.</p>
              ) : (
                questions.map((q, idx) => (
                  <div className="question-card" key={q.id}>
                    <div className="qc-header">
                      <div className="qc-header-left">
                        <div className="qc-number active">{idx + 1}</div>
                        <span className="qc-type">Pilihan Ganda</span>
                      </div>
                      <div className="qc-header-right" style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-icon edit" onClick={() => navigate('/tambah-soal', { state: { editData: q } })} title="Edit Soal"><Pencil size={18} /></button>
                        <button className="btn-icon delete" onClick={() => handleDelete(q.id)}><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div className="qc-body">
                      <h4 className="qc-question-text">{q.pertanyaan}</h4>
                      <div className="qc-options-list">
                        <div className={`qc-option ${q.kunci_jawaban === 'A' ? 'correct' : ''}`}>
                          <div className="qc-option-letter">A</div>
                          <span className="qc-option-text">{q.opsi_a}</span>
                          {q.kunci_jawaban === 'A' && <CheckCircle2 size={14} className="qc-correct-icon" />}
                        </div>
                        <div className={`qc-option ${q.kunci_jawaban === 'B' ? 'correct' : ''}`}>
                          <div className="qc-option-letter">B</div>
                          <span className="qc-option-text">{q.opsi_b}</span>
                          {q.kunci_jawaban === 'B' && <CheckCircle2 size={14} className="qc-correct-icon" />}
                        </div>
                        <div className={`qc-option ${q.kunci_jawaban === 'C' ? 'correct' : ''}`}>
                          <div className="qc-option-letter">C</div>
                          <span className="qc-option-text">{q.opsi_c}</span>
                          {q.kunci_jawaban === 'C' && <CheckCircle2 size={14} className="qc-correct-icon" />}
                        </div>
                        <div className={`qc-option ${q.kunci_jawaban === 'D' ? 'correct' : ''}`}>
                          <div className="qc-option-letter">D</div>
                          <span className="qc-option-text">{q.opsi_d}</span>
                          {q.kunci_jawaban === 'D' && <CheckCircle2 size={14} className="qc-correct-icon" />}
                        </div>
                        {q.opsi_e && (
                          <div className={`qc-option ${q.kunci_jawaban === 'E' ? 'correct' : ''}`}>
                            <div className="qc-option-letter">E</div>
                            <span className="qc-option-text">{q.opsi_e}</span>
                            {q.kunci_jawaban === 'E' && <CheckCircle2 size={14} className="qc-correct-icon" />}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="qc-footer">
                      <div className="qc-meta-tags">
                        <span className="qc-tag gray">Modul: {q.modul_judul}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoalPage;
