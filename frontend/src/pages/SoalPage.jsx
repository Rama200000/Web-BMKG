import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  KeyRound,
  Plus,
  BookOpen,
  Filter,
  ArrowDownUp,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Save,
  MessageSquare
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './SoalPage.css';

function SoalPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tipeSoal, setTipeSoal] = useState('pilihan_ganda');

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
            <button className="topbar-notification">
              <Bell />
              <span className="notification-badge"></span>
            </button>
            <div className="topbar-profile">
              <div className="profile-avatar">A</div>
              <div className="profile-info">
                <span className="profile-name">Admin</span>
                <span className="profile-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="soal-content">
          
          {/* Header */}
          <div className="soal-header-wrapper">
            <div className="soal-breadcrumb">
              <Link to="/dashboard" className="soal-breadcrumb-link">Dashboard</Link>
              <ChevronRight size={14} />
              <span className="soal-breadcrumb-active">Soal</span>
            </div>
            
            <div className="soal-title-row">
              <div className="soal-title-left">
                <h1 className="soal-title">Manajemen Bank Soal</h1>
                <span className="soal-badge">v2.4 Academic</span>
              </div>
              <div className="soal-title-actions">
                <button className="btn-atur-kunci">
                  <KeyRound size={16} />
                  Atur Jawaban Kunci
                </button>
                <Link to="/tambah-soal" className="btn-tambah-soal" style={{ textDecoration: 'none' }}>
                  <Plus size={16} />
                  Tambah Soal
                </Link>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="soal-filter-bar">
            <div className="filter-left">
              <div className="filter-icon">
                <BookOpen size={18} />
              </div>
              <span className="filter-label">MODUL AKTIF:</span>
              <select className="filter-select">
                <option>Dasar Pemrograman (TK-101)</option>
                <option>Web Development (WD-201)</option>
              </select>
            </div>
            <div className="filter-right">
              <div className="stat-pill">
                <div className="stat-dot blue"></div>
                Total Soal: <strong>25</strong>
              </div>
              <div className="stat-pill">
                <div className="stat-dot green"></div>
                Pilihan Ganda: <strong>20</strong>
              </div>
              <div className="stat-pill">
                <div className="stat-dot gray"></div>
                Essay: <strong>5</strong>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="soal-grid">
            
            {/* Left Column (List) */}
            <div className="soal-list-column">
              <div className="question-list-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h3 className="question-list-title">Daftar Pertanyaan</h3>
                  <span className="question-list-subtitle">(3 Ditampilkan)</span>
                </div>
                <div className="question-list-actions">
                  <button className="question-action-btn"><Filter size={16} /></button>
                  <button className="question-action-btn"><ArrowDownUp size={16} /></button>
                </div>
              </div>

              {/* Question Card 1 */}
              <div className="question-card">
                <div className="qc-header">
                  <div className="qc-header-left">
                    <div className="qc-number">1</div>
                    <span className="qc-type-badge">Pilihan Ganda</span>
                    <span className="qc-status"><CheckCircle2 size={12} /> Kunci Terkonfirmasi</span>
                  </div>
                  <div className="qc-actions">
                    <button className="qc-btn lihat"><Eye size={14} /> Lihat</button>
                    <button className="qc-btn edit"><Pencil size={14} /> Edit</button>
                    <button className="qc-btn hapus"><Trash2 size={14} /> Hapus</button>
                  </div>
                </div>
                
                <h4 className="qc-question-text">Apa perintah untuk menampilkan output di JavaScript?</h4>
                
                <div className="qc-options-grid">
                  <div className="qc-option correct">
                    <div className="qc-option-label">A</div>
                    <span>console.log()</span>
                    <CheckCircle2 size={16} className="qc-option-icon" />
                  </div>
                  <div className="qc-option">
                    <div className="qc-option-label">B</div>
                    <span>alert()</span>
                  </div>
                  <div className="qc-option">
                    <div className="qc-option-label">C</div>
                    <span>document.write()</span>
                  </div>
                  <div className="qc-option">
                    <div className="qc-option-label">D</div>
                    <span>print()</span>
                  </div>
                </div>
                
                <div className="qc-footer">
                  <span className="qc-footer-kunci">Kunci: <strong>A. console.log()</strong></span>
                  <span className="qc-footer-bobot">Bobot: 4 Poin</span>
                </div>
              </div>

              {/* Question Card 2 */}
              <div className="question-card">
                <div className="qc-header">
                  <div className="qc-header-left">
                    <div className="qc-number" style={{ background: '#f1f5f9', color: '#475569' }}>2</div>
                    <span className="qc-type-badge">Pilihan Ganda</span>
                    <span className="qc-status"><CheckCircle2 size={12} /> Kunci Terkonfirmasi</span>
                  </div>
                  <div className="qc-actions">
                    <button className="qc-btn lihat"><Eye size={14} /> Lihat</button>
                    <button className="qc-btn edit"><Pencil size={14} /> Edit</button>
                    <button className="qc-btn hapus"><Trash2 size={14} /> Hapus</button>
                  </div>
                </div>
                
                <h4 className="qc-question-text">Apa fungsi dari tag &lt;div&gt; dalam HTML?</h4>
                
                <div className="qc-footer">
                  <span className="qc-footer-kunci">Kunci: <strong>B. Container / pembungkus elemen</strong></span>
                  <span className="qc-footer-bobot">Bobot: 4 Poin</span>
                </div>
              </div>

              {/* Question Card 3 */}
              <div className="question-card">
                <div className="qc-header">
                  <div className="qc-header-left">
                    <div className="qc-number" style={{ background: '#f1f5f9', color: '#475569' }}>3</div>
                    <span className="qc-type-badge">Pilihan Ganda</span>
                    <span className="qc-status"><CheckCircle2 size={12} /> Kunci Terkonfirmasi</span>
                  </div>
                  <div className="qc-actions">
                    <button className="qc-btn lihat"><Eye size={14} /> Lihat</button>
                    <button className="qc-btn edit"><Pencil size={14} /> Edit</button>
                    <button className="qc-btn hapus"><Trash2 size={14} /> Hapus</button>
                  </div>
                </div>
                
                <h4 className="qc-question-text">Bahasa pemrograman untuk web interaktif?</h4>
                
                <div className="qc-footer">
                  <span className="qc-footer-kunci">Kunci: <strong>C. JavaScript</strong></span>
                  <span className="qc-footer-bobot">Bobot: 4 Poin</span>
                </div>
              </div>

              {/* Pagination */}
              <div className="soal-pagination">
                <span className="pagination-text">Menampilkan 3 dari 25 butir soal</span>
                <div className="pagination-controls">
                  <button className="page-btn"><ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /></button>
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <button className="page-btn"><ChevronRight size={14} /></button>
                </div>
              </div>

            </div>

            {/* Right Column (Editor) */}
            <div className="soal-editor-column">
              <div className="editor-card">
                
                <div className="editor-header">
                  <div className="editor-header-left">
                    <div className="editor-icon">
                      <MessageSquare size={20} />
                    </div>
                    <div className="editor-title">
                      <h3>Ubah Soal #1</h3>
                      <p>Editor parameter & format jawaban</p>
                    </div>
                  </div>
                  <span className="editor-id-badge">ID: Q-0081</span>
                </div>

                <div className="editor-form-group">
                  <label className="editor-label">Pilih Modul <span>*</span></label>
                  <select className="editor-input">
                    <option>Dasar Pemrograman</option>
                  </select>
                </div>

                <div className="editor-form-group">
                  <label className="editor-label">Tipe Soal</label>
                  <div className="type-toggle">
                    <label className={`type-radio ${tipeSoal === 'pilihan_ganda' ? 'active' : ''}`}>
                      <input type="radio" name="tipe" checked={tipeSoal === 'pilihan_ganda'} onChange={() => setTipeSoal('pilihan_ganda')} />
                      <span className="type-radio-text">Pilihan Ganda</span>
                    </label>
                    <label className={`type-radio ${tipeSoal === 'essay' ? 'active' : ''}`}>
                      <input type="radio" name="tipe" checked={tipeSoal === 'essay'} onChange={() => setTipeSoal('essay')} />
                      <span className="type-radio-text">Essay</span>
                    </label>
                  </div>
                </div>

                <div className="editor-form-group">
                  <label className="editor-label">
                    <span>Pertanyaan *</span>
                    <span className="editor-label-hint">Markdown didukung</span>
                  </label>
                  <textarea className="editor-input" defaultValue="Apa perintah untuk menampilkan output di JavaScript?"></textarea>
                </div>

                <div className="editor-form-group">
                  <label className="editor-label">Pilihan Jawaban</label>
                  <div className="option-inputs">
                    <div className="option-input-row">
                      <div className="option-input-label">A</div>
                      <input type="text" className="editor-input" defaultValue="console.log()" />
                    </div>
                    <div className="option-input-row">
                      <div className="option-input-label">B</div>
                      <input type="text" className="editor-input" defaultValue="alert()" />
                    </div>
                    <div className="option-input-row">
                      <div className="option-input-label">C</div>
                      <input type="text" className="editor-input" defaultValue="document.write()" />
                    </div>
                    <div className="option-input-row">
                      <div className="option-input-label">D</div>
                      <input type="text" className="editor-input" defaultValue="print()" />
                    </div>
                  </div>
                </div>

                <div className="editor-form-group">
                  <label className="editor-label">Jawaban Benar / Kunci <CheckCircle2 size={12} style={{ color: '#16a34a', marginLeft: 4, display: 'inline' }} /></label>
                  <select className="editor-input success">
                    <option>A. console.log()</option>
                  </select>
                </div>

                <div className="editor-footer">
                  <button className="btn-batal">Batal</button>
                  <button className="btn-simpan"><Save size={14} /> Simpan</button>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Alert */}
          <div className="soal-alert-bottom">
            <div className="soal-alert-left">
              <CheckCircle2 size={20} className="alert-icon-blue" />
              <div className="soal-alert-text">
                <span className="alert-badge">Standar Kurikulum Nasional EduQuiz v2.4</span>
                <h4>Validasi Otomatis Format & Kunci Soal</h4>
                <p>Setiap butir soal tersimpan diverifikasi secara langsung terhadap bobot modul, distribusi opsi jawaban, dan kesesuaian kunci untuk mencegah ambiguitas saat ujian berlangsung.</p>
              </div>
            </div>
            <button className="btn-dokumentasi">Dokumentasi Format</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SoalPage;
