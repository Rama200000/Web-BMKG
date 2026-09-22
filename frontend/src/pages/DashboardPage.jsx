import { useState } from 'react';
import {
  Menu,
  Bell,
  Users,
  BookOpen,
  FileQuestion,
  ClipboardList,
  Search,
  ChevronDown,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import Sidebar from '../components/Sidebar';
import './DashboardPage.css';

// Data statistik chart
const lineChartData = [
  { date: '1 Jul', selesai: 12, tidakSelesai: 5 },
  { date: '2 Jul', selesai: 18, tidakSelesai: 8 },
  { date: '3 Jul', selesai: 22, tidakSelesai: 10 },
  { date: '4 Jul', selesai: 28, tidakSelesai: 12 },
  { date: '5 Jul', selesai: 35, tidakSelesai: 14 },
  { date: '6 Jul', selesai: 42, tidakSelesai: 11 },
  { date: '7 Jul', selesai: 48, tidakSelesai: 9 },
];

const donutData = [
  { name: 'Selesai', value: 72, color: '#1E40AF' },
  { name: 'Dalam Proses', value: 18, color: '#f59e0b' },
  { name: 'Tidak Selesai', value: 10, color: '#ef4444' },
];

// Data tabel siswa
const siswaData = [
  { no: 1, nama: 'Alya Putri', sekolah: 'SMKN 1 Bandung', jurusan: 'RPL', kelas: 'XII RPL 1', nilai: 80, status: 'Selesai' },
  { no: 2, nama: 'Bima Pratama', sekolah: 'SMAN 1 Cimahi', jurusan: 'IPA', kelas: 'XII IPA 2', nilai: 65, status: 'Dalam Proses' },
  { no: 3, nama: 'Citra Lestari', sekolah: 'SMKN 2 Bandung', jurusan: 'TKJ', kelas: 'XI TKJ 1', nilai: 70, status: 'Selesai' },
  { no: 4, nama: 'Danu Saputra', sekolah: 'SMA 3 Bandung', jurusan: 'IPS', kelas: 'XI IPS 1', nilai: 55, status: 'Tidak Selesai' },
  { no: 5, nama: 'Eka Wijaya', sekolah: 'SMAN 4 Cimahi', jurusan: 'IPA', kelas: 'XII IPA 1', nilai: 90, status: 'Selesai' },
];

function DashboardPage() {
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

  // Custom tooltip untuk chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          padding: '10px 14px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          border: '1px solid #e2e8f0',
          fontSize: '12px'
        }}>
          <p style={{ fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color }}>
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="dashboard-main">
        {/* Top Bar */}
        <header className="dashboard-topbar" id="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="topbar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              id="sidebar-toggle"
            >
              <Menu />
            </button>
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
        <div className="dashboard-content">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Selamat datang di halaman admin. Berikut adalah ringkasan data sistem.
          </p>

          {/* Stat Cards */}
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-icon blue"><Users /></div>
              <div className="stat-info">
                <span className="stat-label">Total Siswa</span>
                <span className="stat-value">120</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><BookOpen /></div>
              <div className="stat-info">
                <span className="stat-label">Total Modul</span>
                <span className="stat-value">8</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple"><FileQuestion /></div>
              <div className="stat-info">
                <span className="stat-label">Total Soal</span>
                <span className="stat-value">320</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange"><ClipboardList /></div>
              <div className="stat-info">
                <span className="stat-label">Total Pengerjaan</span>
                <span className="stat-value">98</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            {/* Line Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Statistik Pengerjaan</h3>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot blue"></span>
                    <span>Selesai</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot red"></span>
                    <span>Tidak Selesai</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="selesai"
                    name="Selesai"
                    stroke="#1E40AF"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#1E40AF', strokeWidth: 2, stroke: 'white' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tidakSelesai"
                    name="Tidak Selesai"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: 'white' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Donut Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Status Pengerjaan</h3>
              </div>
              <div className="donut-wrapper">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', marginLeft: '48px' }}>
                  <div className="donut-center-text">
                    <div className="donut-center-value">98</div>
                    <div className="donut-center-label">Total</div>
                  </div>
                </div>
                <div className="donut-legends">
                  {donutData.map((item, i) => (
                    <div className="donut-legend-item" key={i}>
                      <span className="donut-legend-dot" style={{ background: item.color }}></span>
                      <span className="donut-legend-label">{item.name}</span>
                      <span className="donut-legend-value">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-footer">
                <span className="chart-footer-text">Pembaruan otomatis realtime</span>
                <span className="chart-footer-link">Detail</span>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="table-section">
            <div className="table-header">
              <div className="table-header-info">
                <h3>Data Siswa Terkini</h3>
                <p>Monitoring pengerjaan kuis siswa secara real-time</p>
              </div>
              <div className="table-actions">
                <div className="search-input">
                  <Search />
                  <input type="text" placeholder="Cari nama siswa, sekolah..." />
                </div>
                <button className="filter-btn">
                  Semua Sekolah <ChevronDown />
                </button>
                <button className="filter-btn">
                  Semua Jurusan <ChevronDown />
                </button>
                <button className="btn-add" id="btn-tambah-siswa">
                  <Plus />
                  Tambah Siswa
                </button>
              </div>
            </div>

            <table className="data-table">
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
                    <td>{siswa.no}</td>
                    <td className="font-medium">{siswa.nama}</td>
                    <td>{siswa.sekolah}</td>
                    <td>{siswa.jurusan}</td>
                    <td>{siswa.kelas}</td>
                    <td className="text-center">{siswa.nilai}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(siswa.status)}`}>
                        {siswa.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title="Lihat"><Eye /></button>
                        <button className="action-btn" title="Edit"><Pencil /></button>
                        <button className="action-btn delete" title="Hapus"><Trash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-footer">
              <span className="table-footer-info">Menampilkan 1 - 5 dari 120 data</span>
              <div className="pagination">
                <button className="page-btn" disabled><ChevronLeft /></button>
                <button className="page-btn active" onClick={() => setCurrentPage(1)}>1</button>
                <button className="page-btn" onClick={() => setCurrentPage(2)}>2</button>
                <button className="page-btn" onClick={() => setCurrentPage(3)}>3</button>
                <span className="page-dots">...</span>
                <button className="page-btn" onClick={() => setCurrentPage(24)}>24</button>
                <button className="page-btn"><ChevronRight /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
