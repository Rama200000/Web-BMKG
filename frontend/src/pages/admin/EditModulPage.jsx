import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Menu, ChevronRight,
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
  AlertCircle
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './EditModulPage.css';

const API_BASE_URL = 'http://localhost:8000/api';

function EditModulPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Form states
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Klimatologi & Pemanasan Global');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // File upload states
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/modules.php?id=${id}`);
        const data = await response.json();
        if (data.success && data.data) {
          setJudul(data.data.judul);
          setKategori(data.data.kategori);
          setDeskripsi(data.data.deskripsi || '');
          if (data.data.file_path) {
            setFileName("File tersimpan: " + data.data.file_path.split('/').pop());
          }
        }
      } catch (error) {
        console.error("Gagal memuat data modul", error);
      }
    };
    if (id) {
      fetchModule();
    }
  }, [id]);

  const handleSimpan = async () => {
    if (!judul.trim()) {
      showToast('Judul Modul wajib diisi!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('judul', judul.trim());
      formData.append('deskripsi', deskripsi.trim());
      formData.append('kategori', kategori);
      formData.append('is_active', 1);
      
      if (fileInputRef.current.files && fileInputRef.current.files.length > 0) {
        formData.append('file', fileInputRef.current.files[0]);
      }

      const response = await fetch(`${API_BASE_URL}/modules.php`, {
        method: 'POST',
        // Do not set Content-Type header when using FormData; fetch will set it to multipart/form-data with boundary
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        showToast('Modul berhasil diperbarui!', 'success');
        setTimeout(() => navigate('/modul'), 1500);
      } else {
        showToast('Gagal memperbarui modul: ' + result.message, 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Terjadi kesalahan server saat menyimpan modul.', 'error');
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
              <span className="breadcrumb-current">Edit Modul</span>
            </div>
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
        <div className="tambah-modul-content">
          <div className="tm-container">
            {/* Header */}
            <div className="tm-header-wrapper">
              <h1 className="tm-title">Edit Modul Pembelajaran</h1>
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
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan Modul'}
              </button>
            </div>
          </div>
        </div>

        {/* Custom Toast Notification */}
        {toast.show && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            animation: 'fadeInUp 0.3s ease forwards'
          }}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{toast.message}</span>
          </div>
        )}

      </div>
    </div>
  );
}

export default EditModulPage;
