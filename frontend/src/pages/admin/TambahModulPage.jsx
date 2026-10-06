import { useState, useRef } from 'react';
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

const API_BASE_URL = 'http://localhost:8000/api';

function TambahModulPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Klimatologi & Pemanasan Global');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // File upload states
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleSimpan = async () => {
    if (!judul.trim()) {
      alert('Judul Modul wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/modules.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul: judul.trim(),
          deskripsi: deskripsi.trim(),
          is_active: 1
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Modul berhasil ditambahkan!');
        navigate('/modul');
      } else {
        alert('Gagal menambahkan modul: ' + result.message);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan server saat menyimpan modul.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <div className="tm-form-group" style={{ flex: 2 }}>
                  <label className="tm-label">Judul Modul <span className="tm-req">*</span></label>
                  <div className="tm-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Contoh: Mitigasi & Adaptasi Perubahan Iklim Global"
                      value={judul}
                      onChange={(e) => setJudul(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="tm-form-group">
                <label className="tm-label">Kategori / Topik Iklim <span className="tm-req">*</span></label>
                <div className="tm-select-wrapper">
                  <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
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
                    placeholder="Tuliskan deskripsi singkat tentang modul ini..."
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
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
                  <div className="dot-green"></div> Opsional (Dapat ditambahkan nanti)
                </span>
              </div>

              <div className="tm-form-group" style={{ marginBottom: 0 }}>
                <label className="tm-label" style={{ fontWeight: 600 }}>Unggah Buku Panduan Digital / Modul PDF BMKG</label>
                <div 
                  className="tm-upload-area" 
                  onClick={() => fileInputRef.current.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="upload-icon-box">
                    <CloudUpload size={24} />
                  </div>
                  <div className="upload-text">
                    <h4>{fileName ? fileName : 'Klik atau seret berkas dokumen PDF / EPUB ke sini'}</h4>
                    <p>Mendukung format PDF/EPUB standar Kemendikbud & BMKG Edu (Maksimal 25 MB)</p>
                  </div>
                  <button type="button" className="btn-pilih-berkas" onClick={(e) => {
                    e.stopPropagation(); // prevent double trigger
                    fileInputRef.current.click();
                  }}>
                    {fileName ? 'Ganti Berkas' : 'Pilih Berkas'}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => {
                      if(e.target.files && e.target.files.length > 0) {
                        setFileName(e.target.files[0].name);
                      }
                    }} 
                    style={{ display: 'none' }} 
                    accept=".pdf,.epub" 
                  />
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
              <button className="btn-simpan-publish" onClick={handleSimpan} disabled={isSubmitting}>
                <CheckCircle2 size={16} />
                {isSubmitting ? 'Menyimpan...' : 'Simpan & Terbitkan Modul'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TambahModulPage;
