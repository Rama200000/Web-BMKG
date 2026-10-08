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
  ChevronLeft
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './ModulPage.css';

const API_BASE_URL = 'http://localhost:8000/api';

function ModulPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [filterSort, setFilterSort] = useState('Terbaru');

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

  useEffect(() => {
    fetchModules();
  }, []);

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
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Data Modul - Si Iklim Muda', 14, 20);
    
    const tableData = filteredModules.map((m, index) => {
      return [index + 1, m.judul, m.kategori || 'Klimatologi & Pemanasan Global', m.deskripsi || '-', m.jumlah_soal || 0];
    });
    
    autoTable(doc, { 
      startY: 30, 
      head: [['No', 'Nama Modul', 'Kategori', 'Deskripsi', 'Jumlah Soal']], 
      body: tableData 
    });
    doc.save('Data_Modul_SiIklimMuda.pdf');
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
            <Link to="/tambah-modul" className="btn-tambah-modul">
              <Plus size={16} />
              Tambah Modul
            </Link>
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
                  <option value="Klimatologi & Pemanasan Global">Klimatologi & Pemanasan Global</option>
                  <option value="Meteorologi Dasar">Meteorologi Dasar</option>
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
    </div>
  );
}

export default ModulPage;
