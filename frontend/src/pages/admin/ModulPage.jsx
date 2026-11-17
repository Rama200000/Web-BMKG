import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, ChevronRight,
  BookOpen,
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  PlaySquare,
  Pencil,
  Trash2,
  ChevronLeft,
  Tags,
  X
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { exportModulPDF } from '../../utils/pdfExport';
import bmkgLogoUrl from '../../assets/bmkg-logo.png';
import './ModulPage.css';
import { API_BASE_URL } from '../../utils/apiConfig';

function ModulPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [filterSort, setFilterSort] = useState('Terbaru');

  // State Kelola Kategori
  const [categories, setCategories] = useState([
    { id: 1, nama: 'Klimatologi & Pemanasan Global' },
    { id: 2, nama: 'Meteorologi Dasar' }
  ]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const fetchModules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/modules.php`);
      const data = await res.json();
      if (data.success) {
        setModules(data.data);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories.php`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchModules();
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    if (e) e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsSavingCategory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/categories.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: newCategoryName.trim() })
      });
      const result = await res.json();
      if (result.success) {
        setNewCategoryName('');
        await fetchCategories();
      } else {
        alert(result.message || 'Gagal menambahkan kategori');
      }
    } catch (err) {
      alert('Gagal menghubungi server untuk menambah kategori');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (window.confirm(`Yakin ingin menghapus kategori "${cat.nama}"? Modul yang sudah menggunakan kategori ini tidak akan terhapus.`)) {
      try {
        const res = await fetch(`${API_BASE_URL}/categories.php?id=${cat.id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
          if (filterKategori === cat.nama) setFilterKategori('Semua');
          await fetchCategories();
        } else {
          alert(result.message || 'Gagal menghapus kategori');
        }
      } catch (err) {
        alert('Gagal menghubungi server');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus modul ini? Semua soal di dalam modul akan terhapus!')) {
      try {
        const res = await fetch(`${API_BASE_URL}/modules.php?id=${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
          fetchModules();
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error('Error deleting:', err);
      }
    }
  };

  const handleEdit = (item) => {
    navigate(`/edit-modul/${item.id}`);
  };

  const filteredModules = modules.filter(m => {
    const matchSearch = m.judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (m.deskripsi && m.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchKategori = filterKategori === 'Semua' || m.kategori === filterKategori;
    
    return matchSearch && matchKategori;
  }).sort((a, b) => {
    if (filterSort === 'Terbaru') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      return new Date(a.created_at) - new Date(b.created_at);
    }
  });

  const handleExport = () => {
    exportModulPDF({
      modules: filteredModules,
      logoUrl: bmkgLogoUrl,
    });
  };

  return (
    <div className={`modul-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="modul-main">
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
              <span className="breadcrumb-current">Modul</span>
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
        <div className="modul-content">
          {/* Header */}
          <div className="modul-header-wrapper">
            <h1 className="modul-title">Kelola Modul</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowCategoryModal(true)} 
                className="btn-kelola-kategori"
              >
                <Tags size={16} />
                Kelola Kategori
              </button>
              <Link to="/tambah-modul" className="btn-tambah-modul">
                <Plus size={16} />
                Tambah Modul
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="modul-stat-cards">
            <div className="modul-stat-card">
              <div className="modul-stat-info">
                <span className="modul-stat-label">TOTAL MODUL</span>
                <span className="modul-stat-value">{isLoading ? '-' : modules.length}</span>
              </div>
              <div className="modul-stat-icon-wrap blue"><BookOpen size={20} /></div>
            </div>
            <div className="modul-stat-card">
              <div className="modul-stat-info">
                <span className="modul-stat-label">TOTAL SOAL</span>
                <div className="stat-value-row">
                  <span className="modul-stat-value">{isLoading ? '-' : modules.reduce((sum, m) => sum + parseInt(m.jumlah_soal || 0), 0)}</span>
                  <span className="modul-stat-subtext">Tersebar di {modules.length} modul</span>
                </div>
              </div>
              <div className="modul-stat-icon-wrap gray"><FileText size={20} /></div>
            </div>
          </div>

          {/* Data Container */}
          <div className="modul-container">
            {/* Filters */}
            <div className="modul-filters">
              <div className="modul-search">
                <Search size={15} />
                <input 
                  type="text" 
                  placeholder="Cari nama modul..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="modul-actions">
                <select 
                  className="modul-action-btn" 
                  value={filterKategori} 
                  onChange={(e) => setFilterKategori(e.target.value)}
                  style={{ appearance: 'auto', cursor: 'pointer', paddingRight: '32px' }}
                >
                  <option value="Semua">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id || c.nama} value={c.nama}>{c.nama}</option>
                  ))}
                </select>

                <select 
                  className="modul-action-btn" 
                  value={filterSort} 
                  onChange={(e) => setFilterSort(e.target.value)}
                  style={{ appearance: 'auto', cursor: 'pointer', paddingRight: '32px' }}
                >
                  <option value="Terbaru">Waktu Update (Terbaru)</option>
                  <option value="Terlama">Waktu Update (Terlama)</option>
                </select>
                <button className="modul-action-btn" onClick={handleExport}>
                  <Download size={15} />
                  Ekspor
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="modul-table-wrapper">
              <table className="modul-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>NO</th>
                    <th>NAMA MODUL</th>
                    <th>KATEGORI</th>
                    <th>DESKRIPSI</th>
                    <th style={{ width: '150px' }}>JUMLAH SOAL</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Memuat modul...</td>
                    </tr>
                  ) : filteredModules.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Data tidak ditemukan.</td>
                    </tr>
                  ) : filteredModules.map((item, index) => (
                    <tr key={item.id}>
                      <td className="td-no">{index + 1}</td>
                      <td>
                        <div className="cell-nama-modul">
                          <div className="modul-icon-wrapper">
                            <PlaySquare size={16} />
                          </div>
                          <span className="nama-modul-text">{item.judul}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge-kategori">{item.kategori || 'Klimatologi & Pemanasan Global'}</span>
                      </td>
                      <td className="td-desc">{item.deskripsi || '-'}</td>
                      <td>
                        <span className="cell-jumlah-soal">
                          <FileText size={14} style={{ marginRight: 6 }} /> {item.jumlah_soal || 0} Soal
                        </span>
                      </td>
                      <td>
                        <div className="modul-row-actions">
                          <button className="row-action-btn edit" title="Edit" onClick={() => handleEdit(item)}>
                            <Pencil size={14} />
                          </button>
                          <button className="row-action-btn delete" title="Hapus" onClick={() => handleDelete(item.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="ds-table-footer">
              <span className="ds-table-info">
                {isLoading ? 'Memuat...' : `Menampilkan ${filteredModules.length} dari ${filteredModules.length} Modul`}
              </span>
              <div className="ds-pagination">
                <button className="page-btn" disabled><ChevronLeft size={14} /></button>
                <button className="page-btn active" onClick={() => setCurrentPage(1)}>1</button>
                <button className="page-btn" disabled><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Kelola Kategori */}
      {showCategoryModal && (
        <div className="modal-overlay-kategori" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-content-kategori" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-kategori">
              <div className="modal-header-title">
                <div className="modal-header-icon">
                  <Tags size={20} />
                </div>
                <div className="modal-title-text">
                  <h3>Kelola Kategori Modul</h3>
                  <p>Tambah atau hapus topik materi modul</p>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setShowCategoryModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-kategori">
              {/* Form Tambah Kategori */}
              <form onSubmit={handleAddCategory} className="kategori-input-row">
                <input 
                  type="text" 
                  placeholder="Ketik nama kategori baru..." 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="btn-tambah-kategori-submit"
                  disabled={isSavingCategory || !newCategoryName.trim()}
                >
                  <Plus size={15} />
                  {isSavingCategory ? 'Menyimpan...' : 'Tambah'}
                </button>
              </form>

              {/* Daftar Kategori */}
              <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Daftar Kategori Aktif ({categories.length})
              </div>
              <div className="kategori-list-wrapper">
                {categories.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    Belum ada kategori
                  </div>
                ) : (
                  categories.map((cat) => (
                    <div key={cat.id || cat.nama} className="kategori-list-item">
                      <span style={{ fontWeight: 500 }}>{cat.nama}</span>
                      <button 
                        type="button" 
                        className="btn-hapus-kategori"
                        title="Hapus kategori"
                        onClick={() => handleDeleteCategory(cat)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="modal-footer-kategori">
              <button 
                type="button" 
                className="modul-action-btn"
                style={{ cursor: 'pointer', padding: '8px 18px', fontWeight: 600 }}
                onClick={() => setShowCategoryModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModulPage;
