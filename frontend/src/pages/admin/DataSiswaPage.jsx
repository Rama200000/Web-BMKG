import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  GraduationCap,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  ChevronLeft,
  Plus,
  TrendingUp,
  LayoutDashboard,
  X
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './DataSiswaPage.css';

const API_BASE_URL = 'http://localhost:8000/api';

const ITEMS_PER_PAGE = 7;

function DataSiswaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Data States
  const [siswaData, setSiswaData] = useState([]);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSekolah, setFilterSekolah] = useState('Semua Sekolah');
  const [filterKelas, setFilterKelas] = useState('Semua Kelas');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentStudent, setCurrentStudent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    no_hp: '',
    sekolah_id: '',
    kelas_id: '',
    jurusan: '',
    jurusanLainnya: '',
    is_active: 1
  });

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Schools
      const resSchools = await fetch(`${API_BASE_URL}/schools.php`);
      const dataSchools = await resSchools.json();
      if (dataSchools.success) setSchools(dataSchools.data);

      // Fetch Classes
      const resClasses = await fetch(`${API_BASE_URL}/classes.php`);
      const dataClasses = await resClasses.json();
      if (dataClasses.success) setClasses(dataClasses.data);

      // Fetch Students
      const resStudents = await fetch(`${API_BASE_URL}/students.php`);
      const dataStudents = await resStudents.json();
      if (dataStudents.success) setSiswaData(dataStudents.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Set default sekolah/kelas values when modal opens if empty
  useEffect(() => {
    if (showModal && modalMode === 'add' && schools.length > 0 && !formData.sekolah_id) {
      setFormData(prev => ({ ...prev, sekolah_id: schools[0].id }));
    }
  }, [showModal, modalMode, schools]);

  useEffect(() => {
    if (showModal && modalMode === 'add' && classes.length > 0 && !formData.kelas_id) {
      // Find classes for the selected school
      const schoolClasses = classes.filter(c => c.sekolah_id == formData.sekolah_id);
      if (schoolClasses.length > 0) {
        setFormData(prev => ({ ...prev, kelas_id: schoolClasses[0].id }));
      }
    }
  }, [showModal, modalMode, classes, formData.sekolah_id]);

  // Form Handling
  const handleSaveStudent = async () => {
    try {
      const finalJurusan = formData.jurusan === 'Lainnya' ? formData.jurusanLainnya.trim() : formData.jurusan;
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const body = modalMode === 'add' ? { ...formData, jurusan: finalJurusan } : { ...formData, id: currentStudent.id, jurusan: finalJurusan };
      
      const response = await fetch(`${API_BASE_URL}/students.php`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        fetchData();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data siswa ini?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/students.php?id=${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
          fetchData();
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      nama: '',
      no_hp: '',
      sekolah_id: schools.length > 0 ? schools[0].id : '',
      kelas_id: '',
      jurusan: '',
      jurusanLainnya: '',
      is_active: 1
    });
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setModalMode('edit');
    setCurrentStudent(student);
    const JURUSAN_OPTS = ['MIPA', 'IPS', 'Bahasa', 'RPL', 'TKJ', 'Multimedia / DKV', 'Akuntansi'];
    const isKnown = !student.jurusan || JURUSAN_OPTS.includes(student.jurusan);
    setFormData({
      nama: student.nama,
      no_hp: student.no_hp,
      sekolah_id: student.sekolah_id,
      kelas_id: student.kelas_id,
      jurusan: isKnown ? (student.jurusan || '') : 'Lainnya',
      jurusanLainnya: isKnown ? '' : student.jurusan,
      is_active: student.is_active
    });
    setShowModal(true);
  };

  // Filter & Pagination Logic
  const filtered = siswaData.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || s.nama.toLowerCase().includes(q)
      || (s.sekolah && s.sekolah.toLowerCase().includes(q))
      || (s.kelas && s.kelas.toLowerCase().includes(q));
    
    const matchSekolah = filterSekolah === 'Semua Sekolah' || s.sekolah === filterSekolah;
    const matchKelas   = filterKelas === 'Semua Kelas' || s.kelas === filterKelas;
    
    return matchSearch && matchSekolah && matchKelas;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const startItem = filtered.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  const handleReset = () => {
    setSearchQuery('');
    setFilterSekolah('Semua Sekolah');
    setFilterKelas('Semua Kelas');
    setCurrentPage(1);
  };

  // Generate unique lists for filter dropdowns based on existing data
  const sekolahList = ['Semua Sekolah', ...new Set(siswaData.map(s => s.sekolah).filter(Boolean))];
  const kelasList   = ['Semua Kelas', ...new Set(siswaData.map(s => s.kelas).filter(Boolean))];

  // Pagination Numbers
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={`ds-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="ds-main">
        {/* Top Bar */}
        <header className="ds-topbar">
          <div className="topbar-left">
            <button
              className="topbar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu />
            </button>
            <div className="topbar-breadcrumb">
              <Link to="/dashboard" className="breadcrumb-root">
                <LayoutDashboard size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Dashboard
              </Link>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <span className="breadcrumb-current">Data Siswa</span>
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
        <div className="ds-content">
          <div className="ds-page-header">
            <div className="ds-title-row">
              <h1 className="ds-page-title">Data Siswa</h1>
              <span className="ds-badge-count">{siswaData.length} Terdaftar</span>
            </div>
          </div>

          <div className="ds-stat-banner">
            <div className="ds-stat-icon-wrap">
              <GraduationCap size={24} />
            </div>
            <div className="ds-stat-body">
              <span className="ds-stat-label">TOTAL SISWA</span>
              <div className="ds-stat-value-row">
                <span className="ds-stat-value">{siswaData.length}</span>
                <span className="ds-stat-growth">
                  <TrendingUp size={13} />
                  Realtime DB
                </span>
              </div>
            </div>
          </div>

          <div className="ds-table-card">
            {/* Filters */}
            <div className="ds-filters">
              <div className="ds-search-box">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Cari nama, sekolah, kelas..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <select
                className="ds-filter-select"
                value={filterSekolah}
                onChange={e => { setFilterSekolah(e.target.value); setCurrentPage(1); }}
              >
                {sekolahList.map(s => <option key={s}>{s}</option>)}
              </select>

              <select
                className="ds-filter-select"
                value={filterKelas}
                onChange={e => { setFilterKelas(e.target.value); setCurrentPage(1); }}
              >
                {kelasList.map(k => <option key={k}>{k}</option>)}
              </select>

              <button className="ds-refresh-btn" onClick={handleReset} title="Reset filter">
                <RefreshCw size={15} />
              </button>
            </div>

            {/* Table */}
            <div className="ds-table-wrapper">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>NAMA SISWA</th>
                    <th>NO HP (LOGIN)</th>
                    <th>SEKOLAH</th>
                    <th>JURUSAN</th>
                    <th>KELAS</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                        Mengambil data dari database...
                      </td>
                    </tr>
                  ) : paginated.length > 0 ? (
                    paginated.map((siswa, idx) => (
                      <tr key={siswa.id}>
                        <td className="td-no">{startItem + idx}</td>
                        <td className="td-nama-siswa">{siswa.nama}</td>
                        <td className="td-no-hp" style={{ color: '#64748b', fontSize: '13px' }}>{siswa.no_hp}</td>
                        <td className="td-sekolah">{siswa.sekolah || `(ID: ${siswa.sekolah_id})`}</td>
                        <td>{siswa.jurusan || '-'}</td>
                        <td>
                          <span className="badge-kelas">{siswa.kelas || `(ID: ${siswa.kelas_id})`}</span>
                        </td>
                        <td>
                          <span className={`badge-status ${siswa.is_active == 1 ? 'aktif' : 'non-aktif'}`}>
                            {siswa.is_active == 1 ? 'Aktif' : 'Non-Aktif'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-actions">
                            <button className="btn-icon edit" onClick={() => openEditModal(siswa)}>
                              <Edit2 size={15} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDelete(siswa.id)}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                        {searchQuery ? 'Data tidak ditemukan.' : 'Belum ada data siswa di database.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer / Pagination */}
            <div className="ds-table-footer">
              <div className="ds-table-info">
                Menampilkan <strong>{startItem}</strong> - <strong>{endItem}</strong> dari total <strong>{filtered.length}</strong> data
              </div>
              
              <div className="ds-pagination">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} />
                </button>
                
                {getPageNumbers().map((num, i) => (
                  num === '...' ? (
                    <span key={`dots-${i}`} className="page-dots">...</span>
                  ) : (
                    <button
                      key={num}
                      className={`page-btn ${currentPage === num ? 'active' : ''}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  )
                ))}

                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Add Button */}
        <button className="ds-fab" onClick={openAddModal}>
          <Plus size={24} />
        </button>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="ds-modal-overlay">
            <div className="ds-modal-content">
              <div className="ds-modal-header">
                <h3 className="ds-modal-title">
                  {modalMode === 'add' ? 'Tambah Data Siswa' : 'Edit Data Siswa'}
                </h3>
                <button className="ds-modal-close" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="ds-modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Masukkan nama lengkap..."
                    value={formData.nama}
                    onChange={e => setFormData({...formData, nama: e.target.value})}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nomor HP (ID Login Siswa)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Contoh: 081234567890"
                      value={formData.no_hp}
                      onChange={e => setFormData({...formData, no_hp: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Akun</label>
                    <select
                      className="form-input"
                      value={formData.is_active}
                      onChange={e => setFormData({...formData, is_active: e.target.value})}
                    >
                      <option value="1">Aktif (Bisa Login)</option>
                      <option value="0">Non-Aktif (Diblokir)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Asal Sekolah</label>
                    <select
                      className="form-input"
                      value={formData.sekolah_id}
                      onChange={e => {
                        setFormData({...formData, sekolah_id: e.target.value, kelas_id: ''});
                      }}
                    >
                      <option value="" disabled>Pilih Sekolah</option>
                      {schools.map(s => (
                        <option key={s.id} value={s.id}>{s.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jurusan</label>
                    <select
                      className="form-input"
                      value={formData.jurusan}
                      onChange={e => setFormData({...formData, jurusan: e.target.value})}
                    >
                      <option value="">Pilih Jurusan</option>
                      <option value="MIPA">MIPA / IPA</option>
                      <option value="IPS">IPS</option>
                      <option value="Bahasa">Bahasa</option>
                      <option value="RPL">RPL</option>
                      <option value="TKJ">TKJ</option>
                      <option value="Multimedia / DKV">Multimedia / DKV</option>
                      <option value="Akuntansi">Akuntansi</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  {formData.jurusan === 'Lainnya' && (
                    <div className="form-group" style={{marginTop: '15px'}}>
                      <label className="form-label">Sebutkan Jurusan</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ketik jurusan..."
                        value={formData.jurusanLainnya}
                        onChange={e => setFormData({...formData, jurusanLainnya: e.target.value})}
                      />
                    </div>
                  )}
                  <div className="form-group" style={{marginTop: '15px'}}>
                    <label className="form-label">Kelas</label>
                    <select
                      className="form-input"
                      value={formData.kelas_id}
                      onChange={e => setFormData({...formData, kelas_id: e.target.value})}
                      disabled={!formData.sekolah_id}
                    >
                      <option value="" disabled>Pilih Kelas</option>
                      {classes
                        .filter(c => c.sekolah_id == formData.sekolah_id)
                        .map(c => (
                          <option key={c.id} value={c.id}>{c.nama}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              </div>
              <div className="ds-modal-footer">
                <button className="ds-btn-outline" onClick={() => setShowModal(false)}>Batal</button>
                <button 
                  className="ds-btn-primary" 
                  onClick={handleSaveStudent}
                  disabled={!formData.nama || !formData.no_hp || !formData.sekolah_id || !formData.kelas_id}
                >
                  Simpan Data
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DataSiswaPage;
