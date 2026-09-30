import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

function SiswaDashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const userEmail = localStorage.getItem('userEmail') || 'siswa@sekolah.id';

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="dashboard-main">
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
              <div className="profile-avatar" style={{ background: '#10b981' }}>S</div>
              <div className="profile-info">
                <span className="profile-name">{userEmail}</span>
                <span className="profile-role">Siswa</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content" style={{ padding: '40px 24px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Selamat Datang di Portal Siswa</h1>
          <p style={{ color: '#475569', fontSize: 14 }}>
            Ini adalah halaman dashboard khusus untuk role <strong>Siswa</strong>. Di sini nantinya Anda bisa melihat daftar ujian yang tersedia, riwayat nilai, dan materi pembelajaran.
          </p>
          
          <div style={{ marginTop: 40, padding: 32, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ color: '#64748b', fontSize: 16, marginBottom: 16 }}>Area Ujian & Modul Belajar</h3>
            <p style={{ color: '#475569', fontSize: 14, marginBottom: 24 }}>
              Sebelum memulai pretest, silakan lengkapi data diri Anda terlebih dahulu.
            </p>
            <Link to="/siswa/data-pengguna" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#10b981', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}>
              Isi Data Pengguna (Pretest)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiswaDashboardPage;
