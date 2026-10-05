import { useState } from 'react';
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
  Check
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './PengaturanSekolahPage.css';

const dummyData = [
  {
    id: 1,
    sekolah: 'SMAN 1 Bandar Lampung',
    jurusan: [
      { nama: 'MIPA', kelas: ['XII MIPA 1', 'XII MIPA 2'] },
      { nama: 'IPS', kelas: ['XII IPS 1'] }
    ],
    iconColor: 'blue'
  },
  {
    id: 2,
    sekolah: 'SMKN 1 Bandar Lampung',
    jurusan: [
      { nama: 'RPL', kelas: ['XII RPL 1', 'XII RPL 2'] },
      { nama: 'TKJ', kelas: ['XII TKJ 1'] }
    ],
    iconColor: 'teal'
  }
];

function PengaturanSekolahPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('satuan');
  
  // State form
  const [sekolah, setSekolah] = useState('SMAN 1 Bandar Lampung');
  const [jurusanInput, setJurusanInput] = useState('');
  const [jurusanList, setJurusanList] = useState(['MIPA / Sains Alam', 'IPS / Sosio-Humaniora']);
  const [kelas, setKelas] = useState('Kelas XII A');

  const handleAddJurusan = () => {
    if (jurusanInput.trim()) {
      setJurusanList([...jurusanList, jurusanInput.trim()]);
      setJurusanInput('');
    }
  };

  const handleRemoveJurusan = (index) => {
    setJurusanList(jurusanList.filter((_, i) => i !== index));
  };

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
              <h1 className="ps-title">Master Data: Asal Sekolah, Jurusan & Kelas</h1>
              <p className="ps-subtitle">
                Kelola dan tambahkan opsi sekolah, program jurusan/peminatan, kelas untuk pengelompokan peserta pre-test & post-test.
              </p>
            </div>
            <div className="ps-banner-right">
              <div className="ps-stat-box">
                <span className="stat-label">Mitra Terdata</span>
                <span className="stat-value blue">4 Sekolah</span>
              </div>
              <div className="ps-stat-box">
                <span className="stat-label">Program Aktif</span>
                <span className="stat-value green">12 Jurusan</span>
              </div>
            </div>
          </div>

          <div className="ps-action-row">
            <button className="btn-tambah-master">
              <PlusCircle size={16} /> Input & Tambah Opsi Baru
            </button>
          </div>

          <div className="ps-grid-container">
            {/* Kiri: Formulir */}
            <div className="ps-form-card">
              <div className="ps-card-header">
                <Settings2 size={18} className="ps-icon-blue" />
                <h2 className="ps-card-title">Formulir Penambahan Opsi Master</h2>
              </div>
              <p className="ps-card-desc">
                Isi data hierarki sekolah, peminatan, atau rombel baru untuk memperbarui repositori form siswa.
              </p>

              {/* Tabs */}
              <div className="ps-tabs">
                <button
                  className={`ps-tab ${activeTab === 'satuan' ? 'active' : ''}`}
                  onClick={() => setActiveTab('satuan')}
                >
                  <span className="tab-dot"></span> Satuan Sekolah
                </button>
                <button
                  className={`ps-tab ${activeTab === 'jurusan' ? 'active' : ''}`}
                  onClick={() => setActiveTab('jurusan')}
                >
                  Jurusan / Peminatan
                </button>
              </div>

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
                  <label>Nama Satuan Pendidikan</label>
                  <div className="ps-input-wrapper">
                    <GraduationCap size={16} className="input-icon" />
                    <input
                      type="text"
                      value={sekolah}
                      onChange={(e) => setSekolah(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="ps-form-step">
                <div className="ps-step-header">
                  <div className="ps-step-title">
                    <BookOpen size={14} />
                    <span>2. JURUSAN / PROGRAM KEAHLIAN TERKAIT</span>
                  </div>
                  <span className="ps-step-badge">Multi-seleksi</span>
                </div>
                <p className="ps-step-desc">Pilih atau centang jurusan yang dibuka untuk program intervensi literasi iklim:</p>
                <div className="ps-add-jurusan">
                  <input
                    type="text"
                    placeholder="+ Tambah Jurusan Baru (contoh: Geomatika Kebumian)"
                    value={jurusanInput}
                    onChange={(e) => setJurusanInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddJurusan()}
                  />
                  <button onClick={handleAddJurusan}>Tambahkan</button>
                </div>
                <div className="ps-jurusan-tags">
                  {jurusanList.map((jur, idx) => (
                    <div key={idx} className="ps-tag">
                      <div className="tag-checkbox"><Check size={10} /></div>
                      <span>{jur}</span>
                      <button className="tag-close" onClick={() => handleRemoveJurusan(idx)}>&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3 */}
              <div className="ps-form-step">
                <div className="ps-step-header">
                  <div className="ps-step-title">
                    <BookOpen size={14} />
                    <span>3. ROMBONGAN BELAJAR (ROMBEL / KELAS) & KUOTA</span>
                  </div>
                  <span className="ps-step-badge green">Siap Disinkron</span>
                </div>
                <div className="ps-input-group">
                  <label>Jenjang / Tingkat</label>
                  <div className="ps-input-wrapper plain">
                    <input
                      type="text"
                      value={kelas}
                      onChange={(e) => setKelas(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button className="btn-submit-master">
                <CloudUpload size={16} /> Simpan & Tambahkan Opsi
              </button>
            </div>

            {/* Kanan: Struktur */}
            <div className="ps-struktur-card">
              <div className="ps-card-header">
                <Settings2 size={18} className="ps-icon-green" />
                <h2 className="ps-card-title">Struktur</h2>
              </div>
              <p className="ps-card-desc">
                Pratinjau langsung pohon data sekolah mitra BMKG
              </p>

              <div className="ps-search-bar">
                <Search size={14} />
                <input type="text" placeholder="Cari sekolah, jurusan, atau kelas..." />
              </div>

              <div className="ps-struktur-list">
                {dummyData.map((data) => (
                  <div key={data.id} className="ps-struktur-item">
                    <div className="ps-struktur-header">
                      <div className="ps-struktur-title">
                        <div className={`ps-icon-box ${data.iconColor}`}>
                          <GraduationCap size={16} />
                        </div>
                        <h3>{data.sekolah}</h3>
                      </div>
                      <button className="btn-delete"><Trash2 size={14} /></button>
                    </div>
                    <div className="ps-struktur-body">
                      {data.jurusan.map((jur, idx) => (
                        <div key={idx} className="ps-jurusan-row">
                          <span className={`ps-badge-jurusan ${data.iconColor}`}>{jur.nama}</span>
                          <div className="ps-kelas-list">
                            {jur.kelas.map((kls, i) => (
                              <span key={i} className="ps-badge-kelas">{kls}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PengaturanSekolahPage;
