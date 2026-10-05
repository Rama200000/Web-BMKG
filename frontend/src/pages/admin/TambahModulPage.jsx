import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  ClipboardList,
  BookOpen,
  Pencil,
  Trash2,
  Plus,
  CloudUpload,
  Info,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './TambahModulPage.css';

function TambahModulPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

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
            <div className="topbar-breadcrumb">
              <span className="breadcrumb-root">Dashboard</span>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <Link to="/modul" className="breadcrumb-root" style={{ textDecoration: 'none' }}>Modul</Link>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <span className="breadcrumb-current">Tambah Modul</span>
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
                <span className="profile-name">Admin</span>
                <span className="profile-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="tambah-modul-content">
          <div className="tm-container">
            {/* Header */}
            <div className="tm-header-wrapper">
              <h1 className="tm-title">Tambah Modul Pembelajaran</h1>
              <button className="btn-batal-header" onClick={() => navigate('/modul')}>
                <ArrowLeft size={16} />
                Batal / Kembali ke Modul
              </button>
            </div>

            {/* Identitas Modul Card */}
            <div className="tm-card">
              <div className="tm-card-header">
                <div className="tm-card-title-row">
                  <ClipboardList size={18} className="tm-icon-blue" />
                  <h2 className="tm-card-title">Identitas Modul</h2>
                </div>
                <span className="tm-card-subtitle">Lengkapi metadata kurikulum</span>
              </div>

              <div className="tm-form-row">
                <div className="tm-form-group" style={{ flex: 1 }}>
                  <label className="tm-label">Kode Modul</label>
                  <div className="tm-input-wrapper tm-input-disabled">
                    <input type="text" value="MOD-IKLIM-009" readOnly />
                    <span className="tm-badge-auto">Auto</span>
                  </div>
                </div>
                <div className="tm-form-group" style={{ flex: 2 }}>
                  <label className="tm-label">Judul Modul <span className="tm-req">*</span></label>
                  <div className="tm-input-wrapper">
                    <input type="text" defaultValue="Mitigasi & Adaptasi Perubahan Iklim Global" />
                  </div>
                </div>
              </div>

              <div className="tm-form-group">
                <label className="tm-label">Kategori / Topik Iklim <span className="tm-req">*</span></label>
                <div className="tm-select-wrapper">
                  <select defaultValue="Klimatologi & Pemanasan Global">
                    <option>Klimatologi & Pemanasan Global</option>
                    <option>Meteorologi Dasar</option>
                  </select>
                  <ChevronDown size={16} className="select-icon" />
                </div>
              </div>

              <div className="tm-form-group" style={{ marginBottom: 0 }}>
                <label className="tm-label">Deskripsi Singkat Modul</label>
                <div className="tm-input-wrapper" style={{ padding: 0 }}>
                  <textarea 
                    rows={3}
                    defaultValue="Pemahaman komprehensif mengenai fenomena anomali cuaca global, efek gas rumah kaca, serta aksi mitigasi terapan berbasis lingkungan ekosistem sekolah."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Materi & Struktur Bab Card */}
            <div className="tm-card">
              <div className="tm-card-header">
                <div className="tm-card-title-row">
                  <BookOpen size={18} className="tm-icon-blue" />
                  <h2 className="tm-card-title">Materi & Struktur Bab</h2>
                </div>
                <span className="tm-card-subtitle tm-text-green">
                  <div className="dot-green"></div> 1 Materi Terdaftar
                </span>
              </div>

              <div className="tm-chapter-list">
                <div className="tm-chapter-item">
                  <div className="tm-chapter-left">
                    <div className="tm-chapter-number">1</div>
                    <div className="tm-chapter-info">
                      <h4>Bab 1: Pengenalan Emisi Karbon & Siklus Atmosfer</h4>
                      <p>Durasi baca: ~12 menit • 4 infografis interaktif</p>
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
                <label className="tm-label" style={{ fontWeight: 600 }}>Unggah Buku Panduan Digital / Modul PDF BMKG</label>
                <div className="tm-upload-area">
                  <div className="upload-icon-box">
                    <CloudUpload size={24} />
                  </div>
                  <div className="upload-text">
                    <h4>Klik atau seret berkas dokumen PDF / EPUB ke sini</h4>
                    <p>Mendukung format PDF/EPUB standar Kemendikbud & BMKG Edu (Maksimal 25 MB)</p>
                  </div>
                  <button className="btn-pilih-berkas">Pilih Berkas</button>
                </div>
              </div>
            </div>
            
            {/* Spacer for footer */}
            <div style={{ height: 100 }}></div>

          </div>
        </div>

        {/* Fixed Footer */}
        <div className="tm-footer-fixed">
          <div className="tm-footer-container">
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
    </div>
  );
}

export default TambahModulPage;
