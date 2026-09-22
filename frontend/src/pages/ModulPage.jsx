import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  BookOpen,
  FileText,
  Star,
  Cloud,
  Search,
  Filter,
  Download,
  Plus,
  PlaySquare,
  Globe,
  Database,
  Network,
  Lock,
  GitBranch,
  Pencil,
  Trash2,
  ChevronLeft
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './ModulPage.css';

const modulData = [
  { no: 1, nama: 'Dasar Pemrograman', deskripsi: 'Pengenalan konsep dasar pemrograman', soal: 25, icon: PlaySquare },
  { no: 2, nama: 'Web Development', deskripsi: 'HTML, CSS, JavaScript', soal: 30, icon: Globe },
  { no: 3, nama: 'Basis Data', deskripsi: 'Pengelolaan database', soal: 20, icon: Database },
  { no: 4, nama: 'Jaringan Komputer', deskripsi: 'Konsep dasar jaringan', soal: 15, icon: Network },
  { no: 5, nama: 'Keamanan Siber', deskripsi: 'Dasar keamanan informasi', soal: 10, icon: Lock },
  { no: 6, nama: 'Algoritma & Struktur Data', deskripsi: 'Pemahaman logika pemrograman terstruktur', soal: 20, icon: GitBranch },
];

function ModulPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className={`modul-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="modul-main">
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
        <div className="modul-content">
          {/* Header */}
          <div className="modul-header-wrapper">
            <div className="modul-header-left">
              <div className="modul-breadcrumb">
                <Link to="/dashboard" className="modul-breadcrumb-link">
                  Dashboard
                </Link>
                <ChevronRight size={14} />
                <span className="modul-breadcrumb-active">Modul</span>
              </div>
              <h1 className="modul-title">Kelola Modul</h1>
            </div>
            
            <Link to="/tambah-modul" className="btn-tambah-modul" style={{ textDecoration: 'none' }}>
              <Plus />
              Tambah Modul
            </Link>
          </div>

          {/* Stat Cards */}
          <div className="modul-stat-cards">
            <div className="modul-stat-card">
              <div className="modul-stat-info">
                <span className="modul-stat-label">Total Modul</span>
                <span className="modul-stat-value">8</span>
                <span className="modul-stat-subtext green">↗ Aktif semester ini</span>
              </div>
              <div className="modul-stat-icon blue"><BookOpen /></div>
            </div>
            <div className="modul-stat-card">
              <div className="modul-stat-info">
                <span className="modul-stat-label">Total Soal</span>
                <span className="modul-stat-value">120</span>
                <span className="modul-stat-subtext">Rata-rata 20 per modul</span>
              </div>
              <div className="modul-stat-icon"><FileText /></div>
            </div>
            <div className="modul-stat-card">
              <div className="modul-stat-info">
                <span className="modul-stat-label">Modul Terbanyak</span>
                <span className="modul-stat-value">Web Developme...</span>
                <span className="modul-stat-subtext">30 Butir soal</span>
              </div>
              <div className="modul-stat-icon blue"><Star /></div>
            </div>
            <div className="modul-stat-card">
              <div className="modul-stat-info">
                <span className="modul-stat-label">Status Sinkronisasi</span>
                <span className="modul-stat-value" style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }}></span>
                  Terhubung
                </span>
                <span className="modul-stat-subtext">Cloud CBT Online</span>
              </div>
              <div className="modul-stat-icon green"><Cloud /></div>
            </div>
          </div>

          {/* Data Container */}
          <div className="modul-container">
            {/* Filters */}
            <div className="modul-filters">
              <div className="modul-search">
                <Search />
                <input type="text" placeholder="Cari nama modul..." />
              </div>
              
              <div className="modul-actions">
                <button className="modul-action-btn">
                  <Filter />
                  Filter
                </button>
                <button className="modul-action-btn">
                  <Download />
                  Ekspor
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="modul-table-wrapper">
              <table className="modul-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>No</th>
                    <th>Nama Modul</th>
                    <th>Deskripsi</th>
                    <th style={{ width: '150px' }}>Jumlah Soal</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {modulData.map((item) => (
                    <tr key={item.no}>
                      <td>{item.no}</td>
                      <td>
                        <div className="cell-nama-modul">
                          <div className="modul-icon-wrapper">
                            <item.icon />
                          </div>
                          <span className="nama-modul-text">{item.nama}</span>
                        </div>
                      </td>
                      <td>{item.deskripsi}</td>
                      <td>
                        <span className="cell-jumlah-soal">
                          {item.soal} Soal
                        </span>
                      </td>
                      <td>
                        <div className="modul-row-actions" style={{ justifyContent: 'center' }}>
                          <button className="row-action-btn edit" title="Edit">
                            <Pencil />
                          </button>
                          <button className="row-action-btn delete" title="Hapus">
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
              <span className="ds-table-info">Menampilkan 1 - 6 dari 8 modul</span>
              <div className="ds-pagination">
                <button className="page-btn" disabled><ChevronLeft size={14} /></button>
                <button className="page-btn active" onClick={() => setCurrentPage(1)}>1</button>
                <button className="page-btn" onClick={() => setCurrentPage(2)}>2</button>
                <button className="page-btn"><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModulPage;
