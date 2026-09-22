import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  Printer,
  Download,
  Users,
  Star,
  CheckCircle2,
  ClipboardList,
  Search,
  Eye,
  BarChart2,
  FileText,
  ChevronLeft
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './HasilSkorPage.css';

const hasilSkorData = [
  { no: 1, initials: 'AP', avatarColor: 'blue', nama: 'Alya Putri', nisn: '0054819201', sekolah: 'SMKN 1 Bandung', kelas: 'XII RPL 1', modul: 'Dasar Pemrograman', nilai: 85, nilaiClass: 'high', status: 'Selesai' },
  { no: 2, initials: 'BP', avatarColor: 'gray', nama: 'Bima Pratama', nisn: '0054819202', sekolah: 'SMAN 1 Cimahi', kelas: 'XII IPA 2', modul: 'Web Development', nilai: 70, nilaiClass: 'medium', status: 'Dalam Proses' },
  { no: 3, initials: 'CL', avatarColor: 'blue', nama: 'Citra Lestari', nisn: '0054819203', sekolah: 'SMKN 2 Bandung', kelas: 'XI TKJ 1', modul: 'Basis Data', nilai: 90, nilaiClass: 'high', status: 'Selesai' },
  { no: 4, initials: 'DS', avatarColor: 'red', nama: 'Danu Saputra', nisn: '0054819204', sekolah: 'SMA 3 Bandung', kelas: 'XI IPS 1', modul: 'Jaringan Komputer', nilai: 60, nilaiClass: 'low', status: 'Tidak Selesai' },
  { no: 5, initials: 'EW', avatarColor: 'blue', nama: 'Eka Wijaya', nisn: '0054819205', sekolah: 'SMAN 4 Cimahi', kelas: 'XII IPA 1', modul: 'Keamanan Siber', nilai: 75, nilaiClass: 'medium', status: 'Selesai' },
  { no: 6, initials: 'FR', avatarColor: 'blue', nama: 'Fajar Ramadhan', nisn: '0054819206', sekolah: 'SMKN 1 Bandung', kelas: 'XII RPL 2', modul: 'Dasar Pemrograman', nilai: 95, nilaiClass: 'high', status: 'Selesai' },
];

function HasilSkorPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Selesai': return 'selesai';
      case 'Dalam Proses': return 'proses';
      case 'Tidak Selesai': return 'tidak-selesai';
      default: return '';
    }
  };

  return (
    <div className={`hasil-skor-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="hasil-skor-main">
        {/* Top Bar */}
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
        <div className="hasil-skor-content">
          
          {/* Header */}
          <div className="hs-header-wrapper">
            <div className="hs-breadcrumb">
              <Link to="/dashboard" className="hs-breadcrumb-link">Dashboard</Link>
              <ChevronRight size={14} />
              <span className="hs-breadcrumb-active">Hasil Skor</span>
            </div>
            
            <div className="hs-title-row">
              <h1 className="hs-title">Hasil Skor</h1>
              <div className="hs-title-actions">
                <button className="btn-cetak">
                  <Printer size={16} /> Cetak
                </button>
                <button className="btn-export">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="hs-stat-cards">
            <div className="hs-stat-card">
              <div className="hs-stat-info">
                <span className="hs-stat-label">Total Peserta</span>
                <span className="hs-stat-value">120</span>
                <span className="hs-stat-subtext green">↗ 100% Terdaftar</span>
              </div>
              <div className="hs-stat-icon blue"><Users size={24} /></div>
            </div>
            <div className="hs-stat-card">
              <div className="hs-stat-info">
                <span className="hs-stat-label">Rata-Rata Nilai</span>
                <span className="hs-stat-value">79.2</span>
                <span className="hs-stat-subtext green">↑ +3.8 poin</span>
              </div>
              <div className="hs-stat-icon blue"><Star size={24} /></div>
            </div>
            <div className="hs-stat-card">
              <div className="hs-stat-info">
                <span className="hs-stat-label">Tingkat Kelulusan</span>
                <span className="hs-stat-value">88.3%</span>
                <span className="hs-stat-subtext green"><CheckCircle2 size={12}/> 106 Siswa lulus</span>
              </div>
              <div className="hs-stat-icon green"><CheckCircle2 size={24} /></div>
            </div>
            <div className="hs-stat-card">
              <div className="hs-stat-info">
                <span className="hs-stat-label">Ujian Berjalan</span>
                <span className="hs-stat-value">14</span>
                <span className="hs-stat-subtext gray">🕒 Sedang aktif</span>
              </div>
              <div className="hs-stat-icon gray"><ClipboardList size={24} /></div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="hs-filter-bar">
            <select className="hs-filter-select">
              <option>Semua Sekolah</option>
            </select>
            <select className="hs-filter-select">
              <option>Semua Jurusan</option>
            </select>
            <select className="hs-filter-select">
              <option>Semua Kelas</option>
            </select>
            <select className="hs-filter-select">
              <option>Semua Modul</option>
            </select>
            <div className="hs-search">
              <Search size={16} />
              <input type="text" placeholder="Cari nama siswa..." />
            </div>
          </div>

          {/* Table Container */}
          <div className="hs-container">
            <div className="hs-table-wrapper">
              <table className="hs-table">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>No</th>
                    <th>Nama Siswa</th>
                    <th>Sekolah</th>
                    <th>Kelas</th>
                    <th>Modul</th>
                    <th style={{ textAlign: 'center' }}>Nilai</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {hasilSkorData.map((item) => (
                    <tr key={item.no}>
                      <td className="hs-cell-no">{item.no}</td>
                      <td>
                        <div className="hs-cell-siswa">
                          <div className={`hs-siswa-avatar ${item.avatarColor}`}>
                            {item.initials}
                          </div>
                          <div className="hs-siswa-info">
                            <span className="hs-siswa-name">{item.nama}</span>
                            <span className="hs-siswa-nisn">NISN: {item.nisn}</span>
                          </div>
                        </div>
                      </td>
                      <td>{item.sekolah}</td>
                      <td>
                        <span className="hs-cell-kelas">{item.kelas}</span>
                      </td>
                      <td>{item.modul}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`hs-cell-nilai ${item.nilaiClass}`}>{item.nilai}</span>
                      </td>
                      <td>
                        <span className={`hs-status-badge ${getStatusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Link to="#" className="hs-btn-detail">
                          <Eye /> Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="soal-pagination" style={{ padding: '16px 20px', margin: 0, borderTop: '1px solid #f1f5f9' }}>
              <span className="pagination-text">Menampilkan 1 - 6 dari 120 data</span>
              <div className="pagination-controls">
                <button className="page-btn"><ChevronLeft size={14} /></button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span style={{ margin: '0 8px', color: '#94a3b8' }}>...</span>
                <button className="page-btn">24</button>
                <button className="page-btn"><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>

          {/* Bottom Alert */}
          <div className="hs-bottom-alert">
            <div className="hs-alert-left">
              <div className="hs-alert-icon">
                <BarChart2 size={24} />
              </div>
              <div className="hs-alert-text">
                <h4>Laporan Hasil Ujian Terpadu</h4>
                <p>Unduh kompilasi statistik performa peserta per sekolah, analisa daya serap modul, serta audit trail kelulusan untuk rekapitulasi ujian semester ini.</p>
              </div>
            </div>
            <button className="btn-rekap">
              <FileText size={16} />
              Rekap Lengkap (.PDF)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HasilSkorPage;
