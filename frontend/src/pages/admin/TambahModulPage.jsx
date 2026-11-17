import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  AlertCircle,
  X
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './TambahModulPage.css';
import { API_BASE_URL } from '../../utils/apiConfig';

function TambahModulPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [judul, setJudul] = useState('');
  const [categories, setCategories] = useState([
    'Klimatologi & Pemanasan Global',
    'Meteorologi Dasar'
  ]);
  const [kategori, setKategori] = useState('Klimatologi & Pemanasan Global');
  const [showModalKategori, setShowModalKategori] = useState(false);
  const [kategoriBaru, setKategoriBaru] = useState('');
  const [isSavingKategori, setIsSavingKategori] = useState(false);
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
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories.php`);
        const result = await res.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          const names = result.data.map(c => c.nama);
          setCategories(names);
          if (!kategori || !names.includes(kategori)) {
            setKategori(names[0]);
          }
        }
      } catch (err) {
        console.warn('Gagal memuat kategori dari server:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleTambahKategori = async (e) => {
    if (e) e.preventDefault();
    if (!kategoriBaru.trim()) return;
    setIsSavingKategori(true);
    try {
      const res = await fetch(`${API_BASE_URL}/categories.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: kategoriBaru.trim() })
      });
      const data = await res.json();
      if (data.success) {
        const newName = data.data?.nama || kategoriBaru.trim();
        if (!categories.includes(newName)) {
          setCategories(prev => [...prev, newName]);
        }
        setKategori(newName);
        setKategoriBaru('');
        setShowModalKategori(false);
        showToast('Kategori baru berhasil ditambahkan!', 'success');
      } else {
        showToast(data.message || 'Gagal menambahkan kategori', 'error');
      }
    } catch (err) {
      showToast('Koneksi gagal saat menambah kategori', 'error');
    } finally {
      setIsSavingKategori(false);
    }
  };

  const handleSimpan = async () => {
    if (!judul.trim()) {
      showToast('Judul Modul wajib diisi!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
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
        showToast('Modul berhasil ditambahkan!', 'success');
        setTimeout(() => navigate('/modul'), 1500);
      } else {
        showToast('Gagal menambahkan modul: ' + result.message, 'error');
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
              <span className="breadcrumb-current">Tambah Modul</span>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="tm-label" style={{ marginBottom: 0 }}>Kategori / Topik Iklim <span className="tm-req">*</span></label>
                  <button
                    type="button"
                    onClick={() => setShowModalKategori(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} /> + Tambah Kategori
                  </button>
                </div>
                <div className="tm-select-wrapper">
                  <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
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

        {/* Modal Tambah Kategori Cepat */}
        {showModalKategori && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '16px'
            }}
            onClick={() => setShowModalKategori(false)}
          >
            <div 
              style={{
                background: 'white',
                width: '100%',
                maxWidth: '420px',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>Tambah Kategori Baru</h3>
                <button 
                  type="button" 
                  onClick={() => setShowModalKategori(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                Masukkan nama kategori atau topik iklim baru. Kategori ini akan otomatis tersimpan dan terpilih pada modul ini.
              </p>
              <form onSubmit={handleTambahKategori}>
                <div style={{ marginBottom: '20px' }}>
                  <input 
                    type="text" 
                    placeholder="Contoh: Geofisika & Seismologi"
                    value={kategoriBaru}
                    onChange={(e) => setKategoriBaru(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowModalKategori(false)}
                    style={{
                      padding: '8px 16px',
                      background: '#f1f5f9',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isSavingKategori || !kategoriBaru.trim()}
                    style={{
                      padding: '8px 18px',
                      background: '#2563eb',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'white',
                      cursor: isSavingKategori || !kategoriBaru.trim() ? 'not-allowed' : 'pointer',
                      opacity: isSavingKategori || !kategoriBaru.trim() ? 0.6 : 1
                    }}
                  >
                    {isSavingKategori ? 'Menyimpan...' : 'Simpan Kategori'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TambahModulPage;
