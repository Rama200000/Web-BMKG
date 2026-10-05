import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Home,
  ChevronRight,
  PlusCircle,
  Settings2,
  Trash2,
  Search,
  BookOpen,
  GraduationCap,
  CloudUpload,
  Check,
  Edit2
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './PengaturanSekolahPage.css';

const API_BASE_URL = 'http://localhost:8000/api';

function PengaturanSekolahPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Data dari Database
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Form Tambah
  const [sekolahBaru, setSekolahBaru] = useState('');
  const [kelasInput, setKelasInput] = useState('');
  const [kelasList, setKelasList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pencarian
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resSchools = await fetch(`${API_BASE_URL}/schools.php`);
      const dataSchools = await resSchools.json();
      if (dataSchools.success) setSchools(dataSchools.data);

      const resClasses = await fetch(`${API_BASE_URL}/classes.php`);
      const dataClasses = await resClasses.json();
      if (dataClasses.success) setClasses(dataClasses.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddKelas = () => {
    if (kelasInput.trim() !== '') {
      setKelasList([...kelasList, kelasInput.trim()]);
      setKelasInput('');
    }
  };

  const handleRemoveKelas = (index) => {
    setKelasList(kelasList.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!sekolahBaru.trim()) {
      alert('Nama sekolah tidak boleh kosong!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 1. Simpan Sekolah
      const resSchool = await fetch(`${API_BASE_URL}/schools.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: sekolahBaru.trim() })
      });
      const schoolData = await resSchool.json();

      if (schoolData.success) {
        const newSchoolId = schoolData.id;

        // 2. Simpan Kelas-kelas (jika ada)
        for (const kelasNama of kelasList) {
          await fetch(`${API_BASE_URL}/classes.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sekolah_id: newSchoolId, nama: kelasNama })
          });
        }
        
        alert('Data sekolah dan kelas berhasil ditambahkan!');
        setSekolahBaru('');
        setKelasList([]);
        fetchData(); // Refresh tampilan struktur
      } else {
        alert(schoolData.message || 'Gagal menyimpan sekolah');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan pada server saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSekolah = async (id) => {
    if(window.confirm('Yakin ingin menghapus sekolah ini? SEMUA data kelas & siswa di sekolah ini akan ikut terhapus!')) {
      try {
        const res = await fetch(`${API_BASE_URL}/schools.php?id=${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
          fetchData();
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus sekolah dari server.');
      }
    }
  };

  const handleEditSekolah = async (id, oldName) => {
    const newName = window.prompt('Ubah Nama Sekolah:', oldName);
    if (newName && newName.trim() !== '' && newName !== oldName) {
      try {
        const res = await fetch(`${API_BASE_URL}/schools.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, nama: newName.trim() })
        });
        const result = await res.json();
        if (result.success) fetchData();
        else alert(result.message);
      } catch (err) {
        console.error(err);
        alert('Gagal mengupdate sekolah.');
      }
    }
  };

  const handleEditKelas = async (id, oldName) => {
    const newName = window.prompt('Ubah Nama Kelas:', oldName);
    if (newName && newName.trim() !== '' && newName !== oldName) {
      try {
        const res = await fetch(`${API_BASE_URL}/classes.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, nama: newName.trim() })
        });
        const result = await res.json();
        if (result.success) fetchData();
        else alert(result.message);
      } catch (err) {
        console.error(err);
        alert('Gagal mengupdate kelas.');
      }
    }
  };

  // Filter struktur
  const filteredSchools = schools.filter(s => 
    searchQuery === '' || s.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`ps-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="ps-main">
        {/* Top Bar */}
        <header className="ps-topbar">
          <div className="topbar-left">
            <button
              className="topbar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu />
            </button>
            <div className="topbar-breadcrumb">
              <Link to="/dashboard" className="breadcrumb-root">
                <Home size={14} style={{ marginRight: 4 }} /> Beranda
              </Link>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <Link to="/data-siswa" className="breadcrumb-root">Data Siswa</Link>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <span className="breadcrumb-current">Pengaturan Sekolah</span>
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
        <div className="ps-content">
          
          {/* Header Banner */}
          <div className="ps-header-banner">
            <div className="ps-banner-left">
              <h1 className="ps-title">Master Data: Asal Sekolah & Kelas</h1>
              <p className="ps-subtitle">
                Kelola dan tambahkan opsi instansi sekolah beserta daftar kelas untuk keperluan registrasi siswa baru ke dalam sistem database secara real-time.
              </p>
            </div>
            <div className="ps-banner-right">
              <div className="ps-stat-box">
                <span className="stat-label">Mitra Terdata</span>
                <span className="stat-value blue">{schools.length} Sekolah</span>
              </div>
              <div className="ps-stat-box">
                <span className="stat-label">Total Rombel</span>
                <span className="stat-value green">{classes.length} Kelas</span>
              </div>
            </div>
          </div>

          <div className="ps-grid-container">
            {/* Kiri: Formulir */}
            <div className="ps-form-card">
              <div className="ps-card-header">
                <Settings2 size={18} className="ps-icon-blue" />
                <h2 className="ps-card-title">Formulir Pendaftaran Sekolah</h2>
              </div>
              <p className="ps-card-desc">
                Masukkan nama sekolah dan kelas-kelas yang tergabung untuk memudahkan pemetaan data di aplikasi.
              </p>

              {/* Step 1 */}
              <div className="ps-form-step">
                <div className="ps-step-header">
                  <div className="ps-step-title">
                    <BookOpen size={14} />
                    <span>1. IDENTITAS SATUAN SEKOLAH</span>
                  </div>
                  <span className="ps-step-badge">Wajib Diisi</span>
                </div>
                <div className="ps-input-group">
                  <label>Nama Satuan Pendidikan Lengkap</label>
                  <div className="ps-input-wrapper">
                    <GraduationCap size={16} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Contoh: SMAN 1 Bandar Lampung"
                      value={sekolahBaru}
                      onChange={(e) => setSekolahBaru(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="ps-form-step" style={{ marginTop: '24px' }}>
                <div className="ps-step-header">
                  <div className="ps-step-title">
                    <BookOpen size={14} />
                    <span>2. DAFTAR ROMBONGAN BELAJAR (KELAS)</span>
                  </div>
                  <span className="ps-step-badge green">Opsional</span>
                </div>
                <p className="ps-step-desc">Ketik nama kelas dan tekan Tambahkan (contoh: XII MIPA 1, XI IPS 2):</p>
                <div className="ps-add-jurusan">
                  <input
                    type="text"
                    placeholder="Contoh: XII MIPA 1"
                    value={kelasInput}
                    onChange={(e) => setKelasInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKelas()}
                  />
                  <button onClick={handleAddKelas} type="button">Tambahkan</button>
                </div>
                <div className="ps-jurusan-tags">
                  {kelasList.map((kls, idx) => (
                    <div key={idx} className="ps-tag">
                      <div className="tag-checkbox"><Check size={10} /></div>
                      <span>{kls}</span>
                      <button className="tag-close" onClick={() => handleRemoveKelas(idx)} type="button">&times;</button>
                    </div>
                  ))}
                  {kelasList.length === 0 && (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Belum ada kelas yang ditambahkan.</span>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button 
                className={`btn-submit-master ${isSubmitting ? 'loading' : ''}`} 
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ marginTop: '32px' }}
              >
                <CloudUpload size={16} /> 
                {isSubmitting ? 'Menyimpan ke Database...' : 'Simpan & Tambahkan Opsi'}
              </button>
            </div>

            {/* Kanan: Struktur */}
            <div className="ps-struktur-card">
              <div className="ps-card-header">
                <Settings2 size={18} className="ps-icon-green" />
                <h2 className="ps-card-title">Struktur Database</h2>
              </div>
              <p className="ps-card-desc">
                Hierarki instansi dan kelas yang saat ini terdaftar di sistem BMKG
              </p>

              <div className="ps-search-bar">
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Cari sekolah..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="ps-struktur-list">
                {isLoading ? (
                  <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Memuat data struktur...</p>
                ) : filteredSchools.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Tidak ada data sekolah terdaftar.</p>
                ) : (
                  filteredSchools.map((sekolah) => {
                    const schoolClasses = classes.filter(c => c.sekolah_id == sekolah.id);
                    return (
                      <div key={sekolah.id} className="ps-struktur-item">
                        <div className="ps-struktur-header">
                          <div className="ps-struktur-title">
                            <div className="ps-icon-box blue">
                              <GraduationCap size={16} />
                            </div>
                            <h3>{sekolah.nama}</h3>
                          </div>
                          <div style={{display:'flex', gap:'8px'}}>
                            <button 
                              className="btn-delete"
                              title="Edit Sekolah" 
                              onClick={() => handleEditSekolah(sekolah.id, sekolah.nama)}
                              style={{color:'#3b82f6', backgroundColor:'#eff6ff'}}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              className="btn-delete"
                              title="Hapus Sekolah" 
                              onClick={() => handleDeleteSekolah(sekolah.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="ps-struktur-body">
                          <div className="ps-jurusan-row">
                            <span className="ps-badge-jurusan teal">Daftar Kelas</span>
                            <div className="ps-kelas-list">
                              {schoolClasses.length > 0 ? (
                                schoolClasses.map(kls => (
                                  <span key={kls.id} className="ps-badge-kelas" style={{cursor: 'pointer'}} title="Klik untuk edit" onClick={() => handleEditKelas(kls.id, kls.nama)}>{kls.nama}</span>
                                ))
                              ) : (
                                <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Belum ada kelas.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PengaturanSekolahPage;
