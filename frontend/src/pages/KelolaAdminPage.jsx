import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import Sidebar from '../components/Sidebar';

function KelolaAdminPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
              <div className="profile-avatar" style={{ background: '#7c3aed' }}>SA</div>
              <div className="profile-info">
                <span className="profile-name">Super Admin</span>
                <span className="profile-role">Root Access</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content" style={{ padding: '40px 24px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Kelola Akun Admin</h1>
          <p style={{ color: '#475569', fontSize: 14 }}>
            Halaman ini eksklusif untuk <strong>Super Admin</strong>. Di sini Anda bisa menambah, mengedit, atau menghapus akun Admin yang memiliki akses ke sistem.
          </p>
          
          <div style={{ marginTop: 40, padding: 32, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ color: '#64748b', fontSize: 16 }}>Daftar Admin Aktif (Segera Hadir)</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KelolaAdminPage;
