import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileQuestion,
  ClipboardCheck,
  Settings,
  LogOut
} from 'lucide-react';
import bmkgLogo from '../assets/bmkg-logo.png';
import './Sidebar.css';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/data-siswa', label: 'Data Siswa', icon: Users },
  { path: '/modul', label: 'Modul', icon: BookOpen },
  { path: '/soal', label: 'Soal', icon: FileQuestion },
  { path: '/hasil-skor', label: 'Hasil Skor', icon: ClipboardCheck },
  { path: '/pengaturan', label: 'Pengaturan', icon: Settings },
];

function Sidebar({ collapsed }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Nanti hubungkan ke backend PHP
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={bmkgLogo} alt="Logo BMKG" />
        </div>
        <div className="sidebar-brand">
          <h2>Si Iklim Muda</h2>
          <p>Badan Meteorologi Klimatologi dan Geofisika</p>
        </div>
      </div>

      {/* Section Title */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">Menu Utama</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            id={`nav-${item.path.replace('/', '')}`}
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="nav-item logout" onClick={handleLogout} id="nav-logout">
          <LogOut />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
