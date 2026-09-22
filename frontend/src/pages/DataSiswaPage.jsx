import { useState } from 'react';
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
import Sidebar from '../components/Sidebar';
import './DataSiswaPage.css';

const siswaData = [
  { no: 1, initials: 'AP', avatarColor: 'blue', nama: 'Alya Putri', nisn: '0064829101', sekolah: 'SMKN 1 Bandung', jurusan: 'RPL', kelas: 'XII RPL 1', nilai: 80, nilaiClass: 'medium', status: 'Selesai' },
  { no: 2, initials: 'BP', avatarColor: 'gray', nama: 'Bima Pratama', nisn: '0064829102', sekolah: 'SMAN 1 Cimahi', jurusan: 'IPA', kelas: 'XII IPA 2', nilai: 65, nilaiClass: 'medium', status: 'Dalam Proses' },
  { no: 3, initials: 'CL', avatarColor: 'green', nama: 'Citra Lestari', nisn: '0064829103', sekolah: 'SMKN 2 Bandung', jurusan: 'TKJ', kelas: 'XI TKJ 1', nilai: 70, nilaiClass: 'medium', status: 'Selesai' },
  { no: 4, initials: 'DS', avatarColor: 'red', nama: 'Danu Saputra', nisn: '0064829104', sekolah: 'SMA 3 Bandung', jurusan: 'IPS', kelas: 'XI IPS 1', nilai: 55, nilaiClass: 'low', status: 'Tidak Selesai' },
  { no: 5, initials: 'EW', avatarColor: 'blue', nama: 'Eka Wijaya', nisn: '0064829105', sekolah: 'SMAN 4 Cimahi', jurusan: 'IPA', kelas: 'XII IPA 1', nilai: 90, nilaiClass: 'high', status: 'Selesai' },
  { no: 6, initials: 'FR', avatarColor: 'blue', nama: 'Fajar Ramadhan', nisn: '0064829106', sekolah: 'SMKN 1 Bandung', jurusan: 'RPL', kelas: 'XII RPL 2', nilai: 75, nilaiClass: 'medium', status: 'Selesai' },
  { no: 7, initials: 'GP', avatarColor: 'blue', nama: 'Gita Permata', nisn: '0064829107', sekolah: 'SMAN 2 Bandung', jurusan: 'IPS', kelas: 'XI IPS 3', nilai: 85, nilaiClass: 'medium', status: 'Selesai' },
];

function DataSiswaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
              <span className="badge-count">120 Terdaftar</span>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="ds-stat-cards">
            <div className="ds-stat-card">
              <div className="ds-stat-icon blue"><GraduationCap /></div>
              <div className="ds-stat-info">
                <span className="ds-stat-label">Total Siswa</span>
                <div className="ds-stat-value-row">
                  <span className="ds-stat-value">120</span>
                  <span className="ds-stat-change positive">↗ 12%</span>
                </div>
              </div>
            </div>
            <div className="ds-stat-card">
              <div className="ds-stat-icon green"><CheckCircle2 /></div>
              <div className="ds-stat-info">
                <span className="ds-stat-label">Selesai Pretest</span>
                <div className="ds-stat-value-row">
                  <span className="ds-stat-value">98</span>
                  <span className="ds-stat-change neutral">81.6%</span>
                </div>
              </div>
            </div>
            <div className="ds-stat-card">
              <div className="ds-stat-icon gray"><MoreHorizontal /></div>
              <div className="ds-stat-info">
                <span className="ds-stat-label">Dalam Proses</span>
                <div className="ds-stat-value-row">
                  <span className="ds-stat-value">14</span>
                  <span className="ds-stat-change neutral">11.6%</span>
                </div>
              </div>
            </div>
            <div className="ds-stat-card">
              <div className="ds-stat-icon red"><XCircle /></div>
              <div className="ds-stat-info">
                <span className="ds-stat-label">Tidak Selesai</span>
                <div className="ds-stat-value-row">
                  <span className="ds-stat-value">8</span>
                  <span className="ds-stat-change negative">6.8%</span>
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
                  {siswaData.map((siswa) => (
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
              <span className="ds-table-info">Menampilkan 1 - 7 dari 120 data</span>
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
