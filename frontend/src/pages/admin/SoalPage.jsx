import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  Filter,
  ArrowDownUp,
  Eye,
  Trash2,
  CheckCircle2,
  Save,
  MessageSquare,
  Lock
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './SoalPage.css';

function SoalPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
              <span className="breadcrumb-root">Dashboard</span>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <span className="breadcrumb-current">Soal</span>
            </div>
            
            <h1 className="soal-title">Manajemen Bank Soal</h1>
          </div>

          {/* Stats Bar */}
          <div className="soal-stats-bar">
            <div className="stat-pill">
              <div className="stat-dot blue"></div>
              <span>Total Soal:</span>
              <strong>25</strong>
            </div>
            <div className="stat-pill">
              <div className="stat-dot green"></div>
              <span>Pilihan Ganda:</span>
              <strong>20</strong>
            </div>
          </div>

          {/* Main Grid */}
          <div className="soal-grid">
            
            {/* Left Column (List) */}
            <div className="soal-list-column">
              <div className="question-list-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 className="question-list-title">Daftar Pertanyaan</h3>
                  <span className="question-list-subtitle">(3 Ditampilkan)</span>
                </div>
                <div className="question-list-actions">
                  <button className="question-action-btn"><Filter size={14} /></button>
                  <button className="question-action-btn"><ArrowDownUp size={14} /></button>
                </div>
              </div>

              {/* Question Card 1 */}
              <div className="question-card">
                <div className="qc-header">
                  <div className="qc-header-left">
                    <div className="qc-number active">1</div>
                    <span className="qc-type-badge">Pilihan Ganda</span>
                    <span className="qc-status"><CheckCircle2 size={12} /> Kunci Terkonfirmasi</span>
                  </div>
                  <div className="qc-actions">
                    <button className="qc-btn lihat"><Eye size={14} /> Lihat</button>
                    <button className="qc-btn hapus"><Trash2 size={14} /> Hapus</button>
                  </div>
                </div>
                
                <h4 className="qc-question-text">Apa perintah untuk menampilkan output di JavaScript?</h4>
                
                <div className="qc-options-grid">
                  <div className="qc-option correct">
                    <div className="qc-option-left">
                      <div className="qc-option-label correct">A</div>
                      <span>console.log()</span>
                    </div>
                    <CheckCircle2 size={16} className="qc-option-icon" />
                  </div>
                  <div className="qc-option">
                    <div className="qc-option-left">
                      <div className="qc-option-label">B</div>
                      <span>alert()</span>
                    </div>
                  </div>
                  <div className="qc-option">
                    <div className="qc-option-left">
                      <div className="qc-option-label">C</div>
                      <span>document.write()</span>
                    </div>
                  </div>
                  <div className="qc-option">
                    <div className="qc-option-left">
                      <div className="qc-option-label">D</div>
                      <span>print()</span>
                    </div>
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
                    <div className="qc-number">2</div>
                    <span className="qc-type-badge">Pilihan Ganda</span>
                    <span className="qc-status"><CheckCircle2 size={12} /> Kunci Terkonfirmasi</span>
                  </div>
                  <div className="qc-actions">
                    <button className="qc-btn lihat"><Eye size={14} /> Lihat</button>
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
                    <div className="qc-number">3</div>
                    <span className="qc-type-badge">Pilihan Ganda</span>
                    <span className="qc-status"><CheckCircle2 size={12} /> Kunci Terkonfirmasi</span>
                  </div>
                  <div className="qc-actions">
                    <button className="qc-btn lihat"><Eye size={14} /> Lihat</button>
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
                  <div className="editor-icon-box">
                    <MessageSquare size={18} />
                  </div>
                  <div className="editor-title">
                    <h3>Tambah Soal</h3>
                    <p>Editor parameter & format jawaban</p>
                  </div>
                </div>

                <div className="editor-form-group">
                  <label className="editor-label">Pilih Modul <span className="req">*</span></label>
                  <div className="editor-select-wrapper light-blue">
                    <select>
                      <option>Dasar Pemrograman</option>
                    </select>
                  </div>
                </div>

                <div className="editor-form-group">
                  <label className="editor-label">Pertanyaan <span className="req">*</span></label>
                  <textarea className="editor-textarea light-blue" defaultValue="Apa perintah untuk menampilkan output di JavaScript?"></textarea>
                </div>

                <div className="editor-form-group">
                  <label className="editor-label">Pilihan Jawaban</label>
                  <div className="option-inputs">
                    <div className="option-input-row">
                      <div className="option-input-label">A</div>
                      <input type="text" className="editor-input light-blue" defaultValue="console.log()" />
                    </div>
                    <div className="option-input-row">
                      <div className="option-input-label">B</div>
                      <input type="text" className="editor-input light-blue" defaultValue="alert()" />
                    </div>
                    <div className="option-input-row">
                      <div className="option-input-label">C</div>
                      <input type="text" className="editor-input light-blue" defaultValue="document.write()" />
                    </div>
                    <div className="option-input-row">
                      <div className="option-input-label">D</div>
                      <input type="text" className="editor-input light-blue" defaultValue="print()" />
                    </div>
                  </div>
                </div>

                <div className="editor-form-group">
                  <label className="editor-label">
                    Jawaban Benar / Kunci 
                    <Lock size={12} style={{ color: '#16a34a', marginLeft: 4 }} />
                  </label>
                  <div className="editor-select-wrapper light-green">
                    <select>
                      <option>A. console.log()</option>
                    </select>
                  </div>
                </div>

                <div className="editor-footer">
                  <button className="btn-batal">Batal</button>
                  <button className="btn-simpan">
                    <Save size={14} /> Simpan
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default SoalPage;
