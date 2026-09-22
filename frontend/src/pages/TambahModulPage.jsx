import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  ClipboardList,
  CheckSquare,
  Settings2,
  BookOpen,
  Pencil,
  Trash2,
  Plus,
  CloudUpload,
  Info,
  CheckCircle2,
  Save,
  ArrowLeft,
  ChevronDown,
  Cloud
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './TambahModulPage.css';

function TambahModulPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // State for form controls (just for visual toggle)
  const [sasaran, setSasaran] = useState('fase-e');
  const [cakupan, setCakupan] = useState('binaan');
  const [isPublished, setIsPublished] = useState(true);

  return (
    <div className={`tambah-modul-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="tambah-modul-main">
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
        <div className="tambah-modul-content">
          
          {/* Header */}
          <div className="tm-header-wrapper">
            <div className="tm-breadcrumb">
              <Link to="/dashboard" className="tm-breadcrumb-link">Dashboard</Link>
              <ChevronRight size={14} />
              <Link to="/modul" className="tm-breadcrumb-link">Modul</Link>
              <ChevronRight size={14} />
              <span className="tm-breadcrumb-active">Tambah Modul</span>
            </div>
            
            <div className="tm-title-row">
              <div className="tm-title-left">
                <h1 className="tm-title">Tambah Modul Pembelajaran</h1>
                <span className="tm-badge">Kurikulum Iklim BMKG 2024/2025</span>
              </div>
              <div className="tm-title-actions">
                <button className="btn-batal-header" onClick={() => navigate('/modul')}>
                  <ArrowLeft size={16} />
                  Batal / Kembali ke Modul
                </button>
                <button className="btn-simpan-draf">
                  <Save size={16} />
                  Simpan Sebagai Draf
                </button>
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div className="tm-form-grid">
            
            {/* Left Column */}
            <div className="tm-col-left">
              
              {/* Identitas Modul Card */}
              <div className="tm-card">
                <div className="tm-card-header">
                  <div className="tm-card-title">
                    <ClipboardList size={18} />
                    Identitas Modul
                  </div>
                  <span className="tm-card-subtitle">Lengkapi metadata kurikulum</span>
                </div>

                <div className="tm-form-row">
                  <div className="tm-form-group" style={{ flex: 0.6 }}>
                    <label className="tm-label">Kode Modul</label>
                    <div className="tm-input-wrapper">
                      <input type="text" className="tm-input disabled" value="MOD-IKLIM-009" readOnly />
                      <span className="tm-input-suffix" style={{ color: '#4338ca', fontWeight: 600, background: '#e0e7ff', padding: '2px 6px', borderRadius: 4 }}>Auto</span>
                    </div>
                  </div>
                  <div className="tm-form-group">
                    <label className="tm-label">Judul Modul <span>*</span></label>
                    <input type="text" className="tm-input" defaultValue="Mitigasi & Adaptasi Perubahan Iklim Global" />
                  </div>
                </div>

                <div className="tm-form-row">
                  <div className="tm-form-group">
                    <label className="tm-label">Kategori / Topik Iklim <span>*</span></label>
                    <div className="tm-input-wrapper">
                      <select className="tm-input" style={{ appearance: 'none', paddingRight: 32 }}>
                        <option>Klimatologi & Pemanasan Global</option>
                        <option>Meteorologi Dasar</option>
                        <option>Kualitas Udara</option>
                      </select>
                      <ChevronDown size={16} style={{ position: 'absolute', right: 12, color: '#64748b', pointerEvents: 'none' }} />
                    </div>
                  </div>
                  <div className="tm-form-group">
                    <label className="tm-label">Tingkat Sasaran Siswa</label>
                    <div className="tm-toggle-group">
                      <button className={`tm-toggle-btn ${sasaran === 'semua' ? 'active' : ''}`} onClick={() => setSasaran('semua')}>Semua</button>
                      <button className={`tm-toggle-btn ${sasaran === 'fase-e' ? 'active' : ''}`} onClick={() => setSasaran('fase-e')}>Fase E (Kelas X)</button>
                      <button className={`tm-toggle-btn ${sasaran === 'fase-f' ? 'active' : ''}`} onClick={() => setSasaran('fase-f')}>Fase F (XI-XII)</button>
                    </div>
                  </div>
                </div>

                <div className="tm-form-group" style={{ marginBottom: 0 }}>
                  <label className="tm-label">Deskripsi Singkat Modul</label>
                  <textarea 
                    className="tm-input" 
                    defaultValue="Pemahaman komprehensif mengenai fenomena anomali cuaca global, efek gas rumah kaca, serta aksi mitigasi terapan berbasis lingkungan ekosistem sekolah."
                  ></textarea>
                </div>
              </div>

              {/* Materi & Struktur Bab Card */}
              <div className="tm-card">
                <div className="tm-card-header">
                  <div className="tm-card-title">
                    <BookOpen size={18} />
                    Materi & Struktur Bab
                  </div>
                  <span className="tm-card-subtitle" style={{ color: '#16a34a', fontWeight: 600 }}>● 3 Materi Terdaftar</span>
                </div>

                <div className="tm-chapter-list">
                  <div className="tm-chapter-item">
                    <div className="tm-chapter-info">
                      <div className="tm-chapter-number">1</div>
                      <div className="tm-chapter-text">
                        <h4>Bab 1: Pengenalan Emisi Karbon & Siklus Atmosfer</h4>
                        <p>Durasi baca: ~12 menit • 4 infografis interaktif</p>
                      </div>
                    </div>
                    <div className="tm-chapter-actions">
                      <button className="row-action-btn edit"><Pencil size={14} /></button>
                      <button className="row-action-btn delete"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  <div className="tm-chapter-item">
                    <div className="tm-chapter-info">
                      <div className="tm-chapter-number">2</div>
                      <div className="tm-chapter-text">
                        <h4>Bab 2: Dampak Cuaca Ekstrem Terhadap Wilayah Maritim RI</h4>
                        <p>Durasi baca: ~18 menit • 2 peta satelit BMKG</p>
                      </div>
                    </div>
                    <div className="tm-chapter-actions">
                      <button className="row-action-btn edit"><Pencil size={14} /></button>
                      <button className="row-action-btn delete"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  <div className="tm-chapter-item">
                    <div className="tm-chapter-info">
                      <div className="tm-chapter-number">3</div>
                      <div className="tm-chapter-text">
                        <h4>Bab 3: Praktik Lapangan: Pembuatan Biopori & Edukasi Warga</h4>
                        <p>Studi Lapangan Mandiri • Panduan Observasi</p>
                      </div>
                    </div>
                    <div className="tm-chapter-actions">
                      <button className="row-action-btn edit"><Pencil size={14} /></button>
                      <button className="row-action-btn delete"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>

                <button className="btn-tambah-bab">
                  <Plus size={16} />
                  Tambah Sub-bab / Materi Baru
                </button>

                <div className="tm-form-group" style={{ marginBottom: 0 }}>
                  <label className="tm-label" style={{ fontWeight: 500 }}>Unggah Buku Panduan Digital / Modul PDF BMKG</label>
                  <div className="tm-upload-area">
                    <div className="upload-icon">
                      <CloudUpload size={20} />
                    </div>
                    <div className="upload-text">
                      <h4>Klik atau seret berkas dokumen PDF / EPUB ke sini</h4>
                      <p>Mendukung format PDF/EPUB standar Kemendikbud & BMKG Edu (Maksimal 25 MB)</p>
                    </div>
                    <button className="btn-pilih-berkas">Pilih Berkas</button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="tm-col-right">
              
              {/* Pengaturan Evaluasi Card */}
              <div className="tm-card">
                <div className="tm-card-header">
                  <div className="tm-card-title">
                    <CheckSquare size={18} />
                    Pengaturan Evaluasi & Soal
                  </div>
                  <Settings2 size={16} style={{ color: '#64748b' }} />
                </div>

                <div className="tm-form-row">
                  <div className="tm-form-group">
                    <label className="tm-label">Estimasi Pengerjaan</label>
                    <div className="tm-input-wrapper">
                      <input type="number" className="tm-input" defaultValue="45" />
                      <span className="tm-input-suffix">Menit</span>
                    </div>
                  </div>
                  <div className="tm-form-group">
                    <label className="tm-label">Jumlah Butir Soal</label>
                    <div className="tm-input-wrapper">
                      <input type="number" className="tm-input" defaultValue="20" />
                      <span className="tm-input-suffix">Soal</span>
                    </div>
                  </div>
                </div>

                <div className="tm-form-group" style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label className="tm-label" style={{ marginBottom: 0 }}>Passing Grade / Batas Kelulusan</label>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1E40AF' }}>75 / 100</span>
                  </div>
                  {/* Progress bar visual */}
                  <div style={{ position: 'relative', height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: 16, marginBottom: 8 }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '75%', background: '#1d4ed8', borderRadius: 2 }}></div>
                    <div style={{ position: 'absolute', left: '60%', top: -4, width: 2, height: 12, background: '#94a3b8' }}></div>
                    <div style={{ position: 'absolute', left: '75%', top: -6, width: 4, height: 16, background: '#1d4ed8', borderRadius: 2 }}></div>
                    <div style={{ position: 'absolute', right: 0, top: -4, width: 2, height: 12, background: '#94a3b8' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                    <span style={{ marginLeft: '50%' }}>Standar Minimal (60)</span>
                    <span style={{ color: '#1d4ed8', fontWeight: 500 }}>Rekomendasi Ahli (75)</span>
                    <span>Sempurna (100)</span>
                  </div>
                </div>

                <div className="tm-form-group" style={{ marginBottom: 0 }}>
                  <label className="tm-label">Tipe Evaluasi Siswa Terintegrasi</label>
                  <div className="tm-checkbox-group">
                    <label className="tm-checkbox-label">
                      <input type="checkbox" style={{ display: 'none' }} defaultChecked />
                      <div className="tm-checkbox-custom"><CheckCircle2 size={12} strokeWidth={3}/></div>
                      <span className="tm-checkbox-text">Pre-test Wajib (Diagnostik Pemahaman Awal)</span>
                    </label>
                    <label className="tm-checkbox-label">
                      <input type="checkbox" style={{ display: 'none' }} defaultChecked />
                      <div className="tm-checkbox-custom"><CheckCircle2 size={12} strokeWidth={3}/></div>
                      <span className="tm-checkbox-text">Post-test Akhir (Kelulusan Nilai CBT)</span>
                    </label>
                    <label className="tm-checkbox-label">
                      <input type="checkbox" style={{ display: 'none' }} />
                      <div className="tm-checkbox-custom"><CheckCircle2 size={12} strokeWidth={3}/></div>
                      <span className="tm-checkbox-text">Studi Kasus Proyek Aksi Iklim Lokal</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Status Aksesibilitas */}
              <div className="tm-card">
                <div className="tm-card-header">
                  <div className="tm-card-title">
                    <Cloud size={18} style={{ color: '#16a34a' }} />
                    Status & Aksesibilitas
                  </div>
                </div>

                <div className="tm-switch-row">
                  <div className="tm-switch-text">
                    <h4>Status Publikasi Modul</h4>
                    <p>Siswa dapat langsung melihat modul di aplikasi</p>
                  </div>
                  <label className="tm-switch">
                    <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                    <span className="tm-slider"></span>
                  </label>
                </div>

                <div className="tm-form-group">
                  <label className="tm-label">Cakupan Sekolah Sasaran</label>
                  <div className="tm-radio-group">
                    <label className={`tm-radio-card ${cakupan === 'binaan' ? 'active' : ''}`}>
                      <input type="radio" name="cakupan" style={{ display: 'none' }} checked={cakupan === 'binaan'} onChange={() => setCakupan('binaan')} />
                      <div className="tm-radio-custom"></div>
                      <div className="tm-radio-text">
                        <h4>Seluruh Sekolah Mitra Binaan BMKG</h4>
                        <p>148 SMA/SMK di 34 Provinsi Terdaftar</p>
                      </div>
                    </label>
                    
                    <label className={`tm-radio-card ${cakupan === 'pilot' ? 'active' : ''}`}>
                      <input type="radio" name="cakupan" style={{ display: 'none' }} checked={cakupan === 'pilot'} onChange={() => setCakupan('pilot')} />
                      <div className="tm-radio-custom"></div>
                      <div className="tm-radio-text">
                        <h4>Sekolah Percontohan / Khusus (Pilot Project)</h4>
                        <p>Hanya SMA Adiwiyata & Lab Iklim</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="tm-alert">
                  <CheckCircle2 size={16} />
                  <div className="tm-alert-text">
                    <h4>Integrasi Cloud CBT Otomatis</h4>
                    <p>Terverifikasi sinkron dengan Server Pusat BMKG</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
          
        </div>

        {/* Fixed Footer Bar */}
        <div className="tm-footer-bar">
          <div className="tm-footer-info">
            <Info size={16} />
            <span>Modul yang disimpan akan langsung didistribusikan ke database aplikasi siswa Si Iklim Muda secara real-time.</span>
          </div>
          <div className="tm-footer-actions">
            <button className="btn-batal-footer" onClick={() => navigate('/modul')}>Batal</button>
            <button className="btn-simpan-publish">
              <CheckCircle2 size={16} />
              Simpan & Terbitkan Modul
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TambahModulPage;
