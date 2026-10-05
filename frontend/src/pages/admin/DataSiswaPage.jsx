import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  GraduationCap,
  Search,
  ChevronDown,
  RefreshCw,
  Eye,
  Trash2,
  ChevronLeft,
  Plus,
  TrendingUp,
  LayoutDashboard,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './DataSiswaPage.css';

// Data dummy siswa (7 per halaman sesuai desain)
const allSiswaData = [
  { no: 1,  nama: 'Eka Wijaya',       sekolah: 'SMAN 2',  jurusan: 'IPA',  kelas: 'XII A' },
  { no: 2,  nama: 'Gita Permata',     sekolah: 'SMAN 2',  jurusan: 'IPS',  kelas: 'XI A'  },
  { no: 3,  nama: 'Alya Putri',       sekolah: 'SMKN 1',  jurusan: 'RPL',  kelas: 'XII C' },
  { no: 4,  nama: 'Bima Pratama',     sekolah: 'SMAN 1',  jurusan: 'IPA',  kelas: 'XII A' },
  { no: 5,  nama: 'Fajar Ramadhan',   sekolah: 'SMKN 1',  jurusan: 'RPL',  kelas: 'XII C' },
  { no: 6,  nama: 'Citra Lestari',    sekolah: 'SMKN 2',  jurusan: 'TKJ',  kelas: 'XI B'  },
  { no: 7,  nama: 'Danu Saputra',     sekolah: 'SMA 3',   jurusan: 'IPS',  kelas: 'XI A'  },
  { no: 8,  nama: 'Hani Rahayu',      sekolah: 'SMAN 1',  jurusan: 'IPA',  kelas: 'XII B' },
  { no: 9,  nama: 'Ilham Saputra',    sekolah: 'SMKN 2',  jurusan: 'TKJ',  kelas: 'XI C'  },
  { no: 10, nama: 'Jeni Kurniawati',  sekolah: 'SMAN 2',  jurusan: 'IPS',  kelas: 'XI A'  },
  { no: 11, nama: 'Kevin Pratama',    sekolah: 'SMKN 1',  jurusan: 'RPL',  kelas: 'XII A' },
  { no: 12, nama: 'Laras Setiawati',  sekolah: 'SMAN 3',  jurusan: 'IPA',  kelas: 'XII C' },
  { no: 13, nama: 'Muhammad Rizki',   sekolah: 'SMAN 1',  jurusan: 'IPA',  kelas: 'XI A'  },
  { no: 14, nama: 'Nadia Putri',      sekolah: 'SMKN 2',  jurusan: 'RPL',  kelas: 'XII B' },
  { no: 15, nama: 'Oscar Firmansyah', sekolah: 'SMA 3',   jurusan: 'IPS',  kelas: 'XII A' },
];

const ITEMS_PER_PAGE = 7;

const jurusanColorMap = {
  'IPA': 'jurusan-ipa',
  'IPS': 'jurusan-ips',
  'RPL': 'jurusan-rpl',
  'TKJ': 'jurusan-tkj',
};

function DataSiswaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage]     = useState(1);
  const [siswaData, setSiswaData]         = useState(allSiswaData);
  const [searchQuery, setSearchQuery]     = useState('');
  const [filterSekolah, setFilterSekolah] = useState('Semua Sekolah');
  const [filterJurusan, setFilterJurusan] = useState('Semua Jurusan');
  const [filterKelas, setFilterKelas]     = useState('Semua Kelas');

  // Gabungkan dari localStorage juga
  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('studentRecords') || '[]');
    const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || '{}');

    const fromStorage = records.map((rec, i) => ({
      no: allSiswaData.length + i + 1,
      nama: rec.nama,
      sekolah: rec.sekolah,
      jurusan: rec.jurusan,
      kelas: rec.kelas,
    }));

    if (currentStudent?.nama) {
      fromStorage.push({
        no: allSiswaData.length + records.length + 1,
        nama: currentStudent.nama,
        sekolah: currentStudent.sekolah,
        jurusan: currentStudent.jurusan,
        kelas: currentStudent.kelas,
      });
    }

    setSiswaData([...allSiswaData, ...fromStorage]);
  }, []);

  // Filter data
  const filtered = siswaData.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || s.nama.toLowerCase().includes(q)
      || s.sekolah.toLowerCase().includes(q)
      || s.kelas.toLowerCase().includes(q);
    const matchSekolah  = filterSekolah  === 'Semua Sekolah'  || s.sekolah  === filterSekolah;
    const matchJurusan  = filterJurusan  === 'Semua Jurusan'  || s.jurusan  === filterJurusan;
    const matchKelas    = filterKelas    === 'Semua Kelas'    || s.kelas    === filterKelas;
    return matchSearch && matchSekolah && matchJurusan && matchKelas;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated   = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const startItem   = filtered.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem     = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  const handleReset = () => {
    setSearchQuery('');
    setFilterSekolah('Semua Sekolah');
    setFilterJurusan('Semua Jurusan');
    setFilterKelas('Semua Kelas');
    setCurrentPage(1);
  };

  const sekolahList  = ['Semua Sekolah',  ...new Set(siswaData.map(s => s.sekolah))];
  const jurusanList  = ['Semua Jurusan',  ...new Set(siswaData.map(s => s.jurusan))];
  const kelasList    = ['Semua Kelas',    ...new Set(siswaData.map(s => s.kelas))];

  // Pagination numbers
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
              id="sidebar-toggle"
            >
              <Menu />
            </button>
            {/* Breadcrumb di topbar */}
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
            <button className="topbar-notification" id="notification-btn">
              <Bell />
              <span className="notification-badge"></span>
            </button>
            <div className="topbar-profile" id="profile-btn">
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
          {/* Page Title */}
          <div className="ds-page-header">
            <div className="ds-title-row">
              <h1 className="ds-page-title">Data Siswa</h1>
              <span className="ds-badge-count">{siswaData.length} Terdaftar</span>
            </div>
          </div>

          {/* Stat Card — Total Siswa */}
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
                  +12%
                </span>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="ds-table-card">
            {/* Filters */}
            <div className="ds-filters">
              <div className="ds-search-box">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Cari nama siswa, sekolah, atau kelas..."
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
                value={filterJurusan}
                onChange={e => { setFilterJurusan(e.target.value); setCurrentPage(1); }}
              >
                {jurusanList.map(j => <option key={j}>{j}</option>)}
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
                    <th>SEKOLAH</th>
                    <th>JURUSAN</th>
                    <th>KELAS</th>
                    <th>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="ds-empty">
                        Tidak ada data siswa yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((siswa) => (
                      <tr key={siswa.no}>
                        <td className="td-no">{siswa.no}</td>
                        <td className="td-nama">{siswa.nama}</td>
                        <td className="td-sekolah">{siswa.sekolah}</td>
                        <td>
                          <span className={`jurusan-badge ${jurusanColorMap[siswa.jurusan] || 'jurusan-default'}`}>
                            {siswa.jurusan}
                          </span>
                        </td>
                        <td className="td-kelas">{siswa.kelas}</td>
                        <td>
                          <div className="ds-action-group">
                            <button className="ds-action-btn view" title="Lihat Detail">
                              <Eye size={16} />
                            </button>
                            <button className="ds-action-btn delete" title="Hapus">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="ds-table-footer">
              <span className="ds-table-info">
                Menampilkan {startItem} – {endItem} dari {filtered.length} data
              </span>
              <div className="ds-pagination">
                <button
                  className="pg-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft size={14} />
                </button>

                {getPageNumbers().map((pg, i) =>
                  pg === '...'
                    ? <span key={`dots-${i}`} className="pg-dots">...</span>
                    : <button
                        key={pg}
                        className={`pg-btn ${pg === currentPage ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pg)}
                      >
                        {pg}
                      </button>
                )}

                <button
                  className="pg-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataSiswaPage;
