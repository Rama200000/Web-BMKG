import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  MoreHorizontal,
  XCircle,
  Search,
  ChevronDown,
  RefreshCw,
  Eye,
  Trash2,
  ChevronLeft
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './DataSiswaPage.css';

const dummySiswaData = [];

function DataSiswaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [siswaData, setSiswaData] = useState(dummySiswaData);

  const loadData = () => {
    const records = JSON.parse(localStorage.getItem('studentRecords') || '[]');
    const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    
    // Format records from localStorage
    const formattedRecords = records.map((rec, index) => ({
      no: dummySiswaData.length + index + 1,
      initials: rec.nama.substring(0, 2).toUpperCase(),
      avatarColor: 'blue',
      nama: rec.nama,
      nisn: 'Baru Scan',
      sekolah: rec.sekolah,
      jurusan: rec.jurusan,
      kelas: rec.kelas,
      nilai: rec.nilaiPretest || '-',
      nilaiClass: rec.nilaiPretest >= 80 ? 'high' : rec.nilaiPretest >= 60 ? 'medium' : 'low',
      status: rec.status || 'Selesai'
    }));

    // If there is a student currently doing it
    if (currentStudent && currentStudent.nama) {
      formattedRecords.push({
        no: dummySiswaData.length + records.length + 1,
        initials: currentStudent.nama.substring(0, 2).toUpperCase(),
        avatarColor: 'gray',
        nama: currentStudent.nama,
        nisn: 'Sedang Aktif',
        sekolah: currentStudent.sekolah,
        jurusan: currentStudent.jurusan,
        kelas: currentStudent.kelas,
        nilai: currentStudent.nilaiPretest || '-',
        nilaiClass: 'medium',
        status: currentStudent.status || 'Dalam Proses'
      });
    }

    setSiswaData([...dummySiswaData, ...formattedRecords]);
  };

  useEffect(() => {
    loadData();
    // Refresh data every 5 seconds to monitor in real-time
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Selesai': return 'selesai';
      case 'Dalam Proses': return 'proses';
      case 'Tidak Selesai': return 'tidak-selesai';
      default: return '';
    }
  };

  return (
    <div className={`data-siswa-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="data-siswa-main">
        {/* Top Bar (Same as Dashboard) */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="topbar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu />
            </button>
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
        <div className="data-siswa-content">
          {/* Header */}
          <div className="page-header">
            <div className="breadcrumb">
              <Link to="/dashboard" className="breadcrumb-link">
                <Menu size={14} style={{ display: 'inline', marginRight: 4 }}/> Dashboard
              </Link>
              <ChevronRight size={14} />
              <span className="breadcrumb-active">Data Siswa</span>
            </div>
            
            <div className="page-title-row">
              <h1 className="page-title">Data Siswa</h1>
              <span className="badge-count">{siswaData.length} Terdaftar</span>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="ds-stat-cards">
            <div className="ds-stat-card">
              <div className="ds-stat-icon blue"><GraduationCap /></div>
              <div className="ds-stat-info">
                <span className="ds-stat-label">Total Siswa</span>
                <div className="ds-stat-value-row">
                  <span className="ds-stat-value">{siswaData.length}</span>
                  <span className="ds-stat-change positive">↗ {siswaData.length > 0 ? '100%' : '0%'}</span>
                </div>
              </div>
            </div>
            <div className="ds-stat-card">
              <div className="ds-stat-icon green"><CheckCircle2 /></div>
              <div className="ds-stat-info">
                <span className="ds-stat-label">Selesai Pretest</span>
                <div className="ds-stat-value-row">
                  <span className="ds-stat-value">{siswaData.filter(s => s.nilai !== '-').length}</span>
                  <span className="ds-stat-change neutral">--</span>
                </div>
              </div>
            </div>
            <div className="ds-stat-card">
              <div className="ds-stat-icon gray"><MoreHorizontal /></div>
              <div className="ds-stat-info">
                <span className="ds-stat-label">Dalam Proses</span>
                <div className="ds-stat-value-row">
                  <span className="ds-stat-value">{siswaData.filter(s => s.status === 'Dalam Proses').length}</span>
                  <span className="ds-stat-change neutral">--</span>
                </div>
              </div>
            </div>
            <div className="ds-stat-card">
              <div className="ds-stat-icon red"><XCircle /></div>
              <div className="ds-stat-info">
                <span className="ds-stat-label">Tidak Selesai</span>
                <div className="ds-stat-value-row">
                  <span className="ds-stat-value">{siswaData.filter(s => s.status === 'Tidak Selesai').length}</span>
                  <span className="ds-stat-change negative">--</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="data-container">
            {/* Filters */}
            <div className="data-filters">
              <div className="search-box">
                <Search />
                <input type="text" placeholder="Cari nama siswa, sekolah, atau kelas..." />
              </div>
              <button className="filter-select">
                Semua Sekolah <ChevronDown />
              </button>
              <button className="filter-select">
                Semua Jurusan <ChevronDown />
              </button>
              <button className="filter-select">
                Semua Kelas <ChevronDown />
              </button>
              <button className="refresh-btn">
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Table */}
            <div className="ds-table-wrapper">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th>Sekolah</th>
                    <th>Jurusan</th>
                    <th>Kelas</th>
                    <th>Nilai Pretest</th>
                    <th>Status Pengerjaan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {siswaData.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                        Belum ada data siswa. Silakan coba tambahkan melalui simulasi scan barcode.
                      </td>
                    </tr>
                  ) : siswaData.map((siswa) => (
                    <tr key={siswa.no}>
                      <td className="cell-no">{siswa.no}</td>
                      <td>
                        <div className="cell-siswa">
                          <div className={`siswa-avatar ${siswa.avatarColor}`}>
                            {siswa.initials}
                          </div>
                          <div className="siswa-info">
                            <span className="siswa-name">{siswa.nama}</span>
                            <span className="siswa-nisn">NISN: {siswa.nisn}</span>
                          </div>
                        </div>
                      </td>
                      <td className="cell-sekolah">{siswa.sekolah}</td>
                      <td>
                        <span className="cell-jurusan">{siswa.jurusan}</span>
                      </td>
                      <td className="cell-kelas">{siswa.kelas}</td>
                      <td>
                        <span className={`cell-nilai ${siswa.nilaiClass}`}>{siswa.nilai}</span>
                      </td>
                      <td>
                        <span className={`status-dot-badge ${getStatusClass(siswa.status)}`}>
                          {siswa.status}
                        </span>
                      </td>
                      <td>
                        <div className="ds-actions">
                          <button className="ds-action-btn" title="Lihat">
                            <Eye />
                          </button>
                          <button className="ds-action-btn" title="Hapus">
                            <Trash2 />
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
              <span className="ds-table-info">Menampilkan {siswaData.length > 0 ? 1 : 0} - {siswaData.length} dari {siswaData.length} data</span>
              <div className="ds-pagination">
                <button className="page-btn" disabled><ChevronLeft size={14} /></button>
                <button className="page-btn active" onClick={() => setCurrentPage(1)}>1</button>
                <button className="page-btn" onClick={() => setCurrentPage(2)}>2</button>
                <button className="page-btn" onClick={() => setCurrentPage(3)}>3</button>
                <span className="page-dots">...</span>
                <button className="page-btn" onClick={() => setCurrentPage(24)}>24</button>
                <button className="page-btn"><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DataSiswaPage;
