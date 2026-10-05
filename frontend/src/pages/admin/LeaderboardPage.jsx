import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  ChevronDown,
  Trophy,
  Award,
  Search,
  Clock,
  Home
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './LeaderboardPage.css';

const leaderboardData = [
  { rank: 1, nama: 'Alya Putri', hp: '1234567890', sekolah: 'SMKN 1 Bandung', kelas: 'XII RPL 1', nilai: 98, benar: 24, total: 25, waktu: '14m 22s' },
  { rank: 2, nama: 'Bima Pratama', hp: '1234567890', sekolah: 'SMAN 1 Cimahi', kelas: 'XII IPA 2', nilai: 96, benar: 24, total: 25, waktu: '16m 08s' },
  { rank: 3, nama: 'Citra Lestari', hp: '1234567890', sekolah: 'SMKN 2 Bandung', kelas: 'XI TKJ 1', nilai: 95, benar: 23, total: 25, waktu: '17m 45s' },
  { rank: 4, nama: 'Danu Saputra', hp: '1234567890', sekolah: 'SMA 3 Bandung', kelas: 'XI IPS 1', nilai: 94, benar: 23, total: 25, waktu: '19m 12s' },
  { rank: 5, nama: 'Eka Wijaya', hp: '1234567890', sekolah: 'SMAN 4 Cimahi', kelas: 'XII IPA 1', nilai: 92, benar: 22, total: 25, waktu: '21m 30s' },
];

function LeaderboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`leaderboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="leaderboard-main">
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
              <Home size={14} className="breadcrumb-icon" />
              <Link to="/dashboard" className="breadcrumb-root">Dashboard</Link>
              <span className="breadcrumb-sep">/</span>
              <Link to="/hasil-skor" className="breadcrumb-root">Hasil Skor</Link>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-root">Tampilkan LeaderBoard</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">Top 5 Siswa Terbaik</span>
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
        <div className="leaderboard-content">
          
          {/* Header Title */}
          <div className="lb-header">
            <div className="lb-header-title-row">
              <div className="lb-title-icon">
                <Award size={24} />
              </div>
              <h1 className="lb-title">Peringkat 5 Siswa Terbaik (Leaderboard)</h1>
            </div>
            <p className="lb-subtitle">
              Peringkat dihitung berdasarkan kombinasi skor nilai tertinggi dan efisiensi<br/>
              kecepatan waktu pengerjaan modul tes.
            </p>
          </div>

          <div className="lb-main-container">
            {/* Top Banner Filter */}
            <div className="lb-top-banner">
              <div className="lb-badge-modul">
                MODUL: MITIGASI & ADAPTASI PERUBAHAN IKLIM
              </div>
              <button className="lb-btn-school-select">
                <Menu size={14} /> Pilih Sekolah: <strong>SMAN 1 Bandar Lampung (Terpilih)</strong> <ChevronDown size={14} />
              </button>
            </div>

            {/* Podium Section */}
            <div className="lb-podium-section">
              <div className="lb-podium-title">
                <Trophy size={16} /> Podium Kehormatan Siswa
              </div>
              
              <div className="lb-podium-cards">
                
                {/* 2nd Place */}
                <div className="lb-podium-card rank-2">
                  <div className="lb-rank-badge silver">2</div>
                  <h3 className="lb-podium-name">Bima Pratama</h3>
                  <p className="lb-podium-school">SMAN 1 Cimahi</p>
                  <span className="lb-podium-class blue-light">XII IPA 2</span>
                  <div className="lb-podium-stats">
                    <div className="lb-podium-stat">
                      <span className="stat-label">SKOR</span>
                      <span className="stat-value green">96</span>
                    </div>
                    <div className="lb-stat-divider"></div>
                    <div className="lb-podium-stat">
                      <span className="stat-label">WAKTU</span>
                      <span className="stat-value"><strong>16m</strong> 08s</span>
                    </div>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="lb-podium-card rank-1">
                  <div className="lb-rank-badge gold-crown">
                    <Award size={18} fill="white" />
                  </div>
                  <h3 className="lb-podium-name">Alya Putri</h3>
                  <p className="lb-podium-school">SMKN 1 Bandung</p>
                  <span className="lb-podium-class blue-dark">XII RPL 1</span>
                  <div className="lb-podium-stats gold-bg">
                    <div className="lb-podium-stat">
                      <span className="stat-label">SKOR</span>
                      <span className="stat-value green">98</span>
                    </div>
                    <div className="lb-stat-divider"></div>
                    <div className="lb-podium-stat">
                      <span className="stat-label">WAKTU</span>
                      <span className="stat-value"><strong>14m</strong> 22s</span>
                    </div>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="lb-podium-card rank-3">
                  <div className="lb-rank-badge bronze">3</div>
                  <h3 className="lb-podium-name">Citra Lestari</h3>
                  <p className="lb-podium-school">SMKN 2 Bandung</p>
                  <span className="lb-podium-class blue-light">XI TKJ 1</span>
                  <div className="lb-podium-stats">
                    <div className="lb-podium-stat">
                      <span className="stat-label">SKOR</span>
                      <span className="stat-value green">95</span>
                    </div>
                    <div className="lb-stat-divider"></div>
                    <div className="lb-podium-stat">
                      <span className="stat-label">WAKTU</span>
                      <span className="stat-value"><strong>17m</strong> 45s</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Table Section */}
            <div className="lb-table-section">
              <div className="lb-table-filters">
                <div className="lb-filters-left">
                  <div className="lb-select-wrap">
                    <select><option>Semua Sekolah</option></select>
                    <ChevronDown size={14} className="select-icon" />
                  </div>
                  <div className="lb-select-wrap">
                    <select><option>Semua Kelas</option></select>
                    <ChevronDown size={14} className="select-icon" />
                  </div>
                </div>
                <div className="lb-search-wrap">
                  <Search size={15} />
                  <input type="text" placeholder="Cari nama siswa..." />
                </div>
              </div>

              <div className="lb-table-wrapper">
                <table className="lb-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px', textAlign: 'center' }}>PERINGKAT</th>
                      <th>NAMA SISWA</th>
                      <th>ASAL SEKOLAH</th>
                      <th>KELAS</th>
                      <th style={{ textAlign: 'center' }}>NILAI<br/>AKHIR</th>
                      <th style={{ textAlign: 'center' }}>WAKTU<br/>PENGERJAAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((row) => (
                      <tr key={row.rank}>
                        <td align="center">
                          <div className={`table-rank-badge rank-${row.rank}`}>
                            #{row.rank}
                          </div>
                        </td>
                        <td>
                          <div className="table-student-info">
                            <span className="table-student-name">{row.nama}</span>
                            <span className="table-student-hp">No Hp: {row.hp}</span>
                          </div>
                        </td>
                        <td>
                          <span className="table-school-name">{row.sekolah}</span>
                        </td>
                        <td>
                          <span className="table-class-badge">{row.kelas}</span>
                        </td>
                        <td align="center">
                          <div className="table-score-info">
                            <span className="table-score-number">{row.nilai}</span>
                            <span className="table-score-detail">{row.benar}/{row.total} Soal</span>
                          </div>
                        </td>
                        <td align="center">
                          <div className="table-time-info">
                            <Clock size={13} />
                            <span>{row.waktu.replace('m', 'm ').replace('s', 's')}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer */}
              <div className="lb-table-footer">
                <div className="footer-text">
                  Menampilkan <strong>5 Siswa Terbaik</strong> dari total <strong>120 Peserta</strong> terdaftar
                </div>
                <div className="footer-status">
                  <div className="status-dot green"></div> Data diperbarui otomatis dari log penilaian tes
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
