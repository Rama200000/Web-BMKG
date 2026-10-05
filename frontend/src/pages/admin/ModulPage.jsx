import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
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
import './ModulPage.css';

const modulData = [
  { no: 1, nama: 'Dasar Pemrograman', deskripsi: 'Pengenalan konsep dasar pemrograman', soal: 25, icon: PlaySquare },
];

function ModulPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
                <span className="modul-stat-value">1</span>
              </div>
              <div className="modul-stat-icon-wrap blue"><BookOpen size={20} /></div>
            </div>
            <div className="modul-stat-card">
              <div className="modul-stat-info">
                <span className="modul-stat-label">TOTAL SOAL</span>
                <div className="stat-value-row">
                  <span className="modul-stat-value">120</span>
                  <span className="modul-stat-subtext">Rata-rata 20 per modul</span>
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
                <input type="text" placeholder="Cari nama modul..." />
              </div>
              
              <div className="modul-actions">
                <button className="modul-action-btn">
                  <Filter size={15} />
                  Filter
                </button>
                <button className="modul-action-btn">
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
                    <th>DESKRIPSI</th>
                    <th style={{ width: '150px' }}>JUMLAH SOAL</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {modulData.map((item) => (
                    <tr key={item.no}>
                      <td className="td-no">{item.no}</td>
                      <td>
                        <div className="cell-nama-modul">
                          <div className="modul-icon-wrapper">
                            <item.icon size={16} />
                          </div>
                          <span className="nama-modul-text">{item.nama}</span>
                        </div>
                      </td>
                      <td className="td-desc">{item.deskripsi}</td>
                      <td>
                        <span className="cell-jumlah-soal">
                          {item.soal} Soal
                        </span>
                      </td>
                      <td>
                        <div className="modul-row-actions">
                          <button className="row-action-btn edit" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button className="row-action-btn delete" title="Hapus">
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
              <span className="ds-table-info">Menampilkan 1 dari 1 Modul</span>
              <div className="ds-pagination">
                <button className="page-btn" disabled><ChevronLeft size={14} /></button>
                <button className="page-btn active" onClick={() => setCurrentPage(1)}>1</button>
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
