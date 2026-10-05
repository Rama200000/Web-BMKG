import { useState, useEffect } from 'react';
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

const API_BASE_URL = 'http://localhost/WEB_BMKG/Web-BMKG/backend/api';

function LeaderboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/skor.php`);
        const result = await res.json();
        if (result.success) {
          // Sort by postTest descending, then map rank
          const sorted = result.data
            .filter(item => item.post_test_score !== null)
            .sort((a, b) => b.post_test_score - a.post_test_score)
            .map((item, index) => ({
              rank: index + 1,
              nama: item.siswa,
              hp: item.hp,
              sekolah: item.sekolah,
              kelas: item.kelas,
              nilai: item.post_test_score,
              benar: Math.round(item.post_test_score / 4), // Asumsi per soal bobot 4
              total: 25,
              waktu: '15m 30s' // Hardcoded fallback unless DB tracks time precisely
            }));
          setLeaderboardData(sorted);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Top 3 for podium
  const top1 = leaderboardData.find(u => u.rank === 1);
  const top2 = leaderboardData.find(u => u.rank === 2);
  const top3 = leaderboardData.find(u => u.rank === 3);

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
              <span className="breadcrumb-current">Tampilkan LeaderBoard</span>
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
          
          <div className="lb-header">
            <div className="lb-header-title-row">
              <div className="lb-title-icon">
                <Award size={24} />
              </div>
              <h1 className="lb-title">Peringkat Siswa Terbaik (Leaderboard)</h1>
            </div>
            <p className="lb-subtitle">
              Peringkat dihitung berdasarkan nilai Post-Test tertinggi.
            </p>
          </div>

          <div className="lb-main-container">
            <div className="lb-top-banner">
              <div className="lb-badge-modul">
                MODUL: MITIGASI & ADAPTASI PERUBAHAN IKLIM
              </div>
            </div>

            {/* Podium Section */}
            <div className="lb-podium-section">
              <div className="lb-podium-title">
                <Trophy size={16} /> Podium Kehormatan Siswa
              </div>
              
              <div className="lb-podium-cards">
                {isLoading ? (
                  <p style={{ margin: 'auto', padding: '2rem', color: '#64748b' }}>Menyusun podium...</p>
                ) : leaderboardData.length === 0 ? (
                  <p style={{ margin: 'auto', padding: '2rem', color: '#64748b' }}>Belum ada data nilai terkumpul.</p>
                ) : (
                  <>
                    {/* 2nd Place */}
                    {top2 && (
                      <div className="lb-podium-card rank-2">
                        <div className="lb-rank-badge silver">2</div>
                        <h3 className="lb-podium-name">{top2.nama}</h3>
                        <p className="lb-podium-school">{top2.sekolah}</p>
                        <span className="lb-podium-class blue-light">{top2.kelas}</span>
                        <div className="lb-podium-stats">
                          <div className="lb-podium-stat">
                            <span className="stat-label">SKOR</span>
                            <span className="stat-value green">{top2.nilai}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 1st Place */}
                    {top1 && (
                      <div className="lb-podium-card rank-1">
                        <div className="lb-rank-badge gold-crown">
                          <Award size={18} fill="white" />
                        </div>
                        <h3 className="lb-podium-name">{top1.nama}</h3>
                        <p className="lb-podium-school">{top1.sekolah}</p>
                        <span className="lb-podium-class blue-dark">{top1.kelas}</span>
                        <div className="lb-podium-stats gold-bg">
                          <div className="lb-podium-stat">
                            <span className="stat-label">SKOR</span>
                            <span className="stat-value green">{top1.nilai}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3rd Place */}
                    {top3 && (
                      <div className="lb-podium-card rank-3">
                        <div className="lb-rank-badge bronze">3</div>
                        <h3 className="lb-podium-name">{top3.nama}</h3>
                        <p className="lb-podium-school">{top3.sekolah}</p>
                        <span className="lb-podium-class blue-light">{top3.kelas}</span>
                        <div className="lb-podium-stats">
                          <div className="lb-podium-stat">
                            <span className="stat-label">SKOR</span>
                            <span className="stat-value green">{top3.nilai}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
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
                      <th style={{ textAlign: 'center' }}>NILAI AKHIR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                       <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Memuat peringkat...</td></tr>
                    ) : leaderboardData.map((row) => (
                      <tr key={row.rank}>
                        <td align="center">
                          <div className={`table-rank-badge rank-${row.rank}`}>
                            #{row.rank}
                          </div>
                        </td>
                        <td>
                          <div className="table-student-info">
                            <span className="table-student-name">{row.nama}</span>
                            {row.hp !== '-' && <span className="table-student-hp">No Hp: {row.hp}</span>}
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
