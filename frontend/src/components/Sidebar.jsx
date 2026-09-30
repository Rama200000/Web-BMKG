import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileQuestion,
  ClipboardCheck,
  Settings,
  LogOut,
  Shield,
  GraduationCap,
  History,
  QrCode
} from 'lucide-react';
import bmkgLogo from '../assets/bmkg-logo.png';
import './Sidebar.css';

const adminMenus = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/data-siswa', label: 'Data Siswa', icon: Users },
  { path: '/modul', label: 'Modul', icon: BookOpen },
  { path: '/soal', label: 'Soal', icon: FileQuestion },
  { path: '/hasil-skor', label: 'Hasil Skor', icon: ClipboardCheck },
  { path: '/qr-code', label: 'QR Code Siswa', icon: QrCode },
  { path: '/pengaturan', label: 'Pengaturan', icon: Settings },
];

const superAdminMenus = [
  ...adminMenus,
  { path: '/kelola-admin', label: 'Kelola Admin', icon: Shield },
];

const siswaMenus = [
  { path: '/siswa/dashboard', label: 'Beranda Siswa', icon: LayoutDashboard },
  { path: '/siswa/modul', label: 'Modul Belajar', icon: GraduationCap },
  { path: '/siswa/riwayat', label: 'Riwayat Ujian', icon: History },
];

function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'admin';

  let currentMenus = adminMenus;
  if (userRole === 'super_admin') currentMenus = superAdminMenus;
  else if (userRole === 'siswa') currentMenus = siswaMenus;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
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
        {currentMenus.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            id={`nav-${item.path.replace(/\//g, '-')}`}
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
