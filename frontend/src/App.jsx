import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import DataSiswaPage from './pages/admin/DataSiswaPage';
import ModulPage from './pages/admin/ModulPage';
import TambahModulPage from './pages/admin/TambahModulPage';
import SoalPage from './pages/admin/SoalPage';
import TambahSoalPage from './pages/admin/TambahSoalPage';
import HasilSkorPage from './pages/admin/HasilSkorPage';
import PengaturanPage from './pages/admin/PengaturanPage';
import SiswaDashboardPage from './pages/siswa/SiswaDashboardPage';
import KelolaAdminPage from './pages/admin/KelolaAdminPage';
import DataPenggunaPage from './pages/siswa/DataPenggunaPage';

import PretestIntroPage from './pages/siswa/PretestIntroPage';
import PretestSoalPage from './pages/siswa/PretestSoalPage';
import HasilPretestPage from './pages/siswa/SiswaHasilPretestPage';
import ModulSiswaPage from './pages/siswa/ModulSiswaPage';
import PosttestIntroPage from './pages/siswa/PosttestIntroPage';
import PosttestSoalPage from './pages/siswa/PosttestSoalPage';
import HasilPosttestPage from './pages/siswa/SiswaHasilPosttestPage';
import './index.css';

// Komponen pelindung rute berdasarkan role
function ProtectedRoute({ children, allowedRoles }) {
  const userRole = localStorage.getItem('userRole');
  
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Jika tidak punya akses, lemparkan ke dashboard masing-masing
    if (userRole === 'siswa') return <Navigate to="/siswa/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Redirect root ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Admin & Super Admin Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/data-siswa" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}><DataSiswaPage /></ProtectedRoute>
        } />
        <Route path="/modul" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}><ModulPage /></ProtectedRoute>
        } />
        <Route path="/tambah-modul" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}><TambahModulPage /></ProtectedRoute>
        } />
        <Route path="/soal" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}><SoalPage /></ProtectedRoute>
        } />
        <Route path="/tambah-soal" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}><TambahSoalPage /></ProtectedRoute>
        } />
        <Route path="/hasil-skor" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}><HasilSkorPage /></ProtectedRoute>
        } />
        <Route path="/pengaturan" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}><PengaturanPage /></ProtectedRoute>
        } />
        
        {/* Super Admin Only Route */}
        <Route path="/kelola-admin" element={
          <ProtectedRoute allowedRoles={['super_admin']}><KelolaAdminPage /></ProtectedRoute>
        } />

        {/* Siswa Public Routes (Tanpa Login) */}
        {/* /scan redirect langsung ke data-pengguna — siswa scan QR via Google Lens */}
        <Route path="/scan" element={<Navigate to="/siswa/data-pengguna" replace />} />
        <Route path="/siswa/data-pengguna" element={<DataPenggunaPage />} />
        <Route path="/siswa/pretest-intro" element={<PretestIntroPage />} />
        <Route path="/siswa/pretest" element={<PretestSoalPage />} />
        <Route path="/siswa/hasil-pretest" element={<HasilPretestPage />} />
        <Route path="/siswa/modul" element={<ModulSiswaPage />} />
        <Route path="/siswa/posttest-intro" element={<PosttestIntroPage />} />
        <Route path="/siswa/posttest" element={<PosttestSoalPage />} />
        <Route path="/siswa/hasil-posttest" element={<HasilPosttestPage />} />

      </Routes>
    </Router>
  );
}

export default App;
