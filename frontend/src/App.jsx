import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import DataSiswaPage from './pages/admin/DataSiswaPage';
import ModulPage from './pages/admin/ModulPage';
import TambahModulPage from './pages/admin/TambahModulPage';
import SoalPage from './pages/admin/SoalPage';
import TambahSoalPage from './pages/admin/TambahSoalPage';
import HasilSkorPageAdmin from './pages/admin/HasilSkorPage';
import PengaturanPage from './pages/admin/PengaturanPage';
import KelolaAdminPage from './pages/admin/KelolaAdminPage';
import QRCodePage from './pages/admin/QRCodePage';

// ─── Siswa: Halaman Baru (Green Theme) ───
import ScanBarcodePage from './pages/siswa/ScanBarcodePage';
import VerifikasiIDPage from './pages/siswa/VerifikasiIDPage';
import BiodataPage from './pages/siswa/BiodataPage';
import SiswaDashboardPage from './pages/siswa/SiswaDashboardPage';
import UjianPage from './pages/siswa/UjianPage';
import HasilSkorPage from './pages/siswa/HasilSkorPage';
import ModulPembelajaranPage from './pages/siswa/ModulPembelajaranPage';
import VerifikasiUlangPage from './pages/siswa/VerifikasiUlangPage';
import HasilAkhirPage from './pages/siswa/HasilAkhirPage';

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

        {/* ═══ Admin & Super Admin Routes ═══ */}
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
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}><HasilSkorPageAdmin /></ProtectedRoute>
        } />
        <Route path="/pengaturan" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}><PengaturanPage /></ProtectedRoute>
        } />
        
        <Route path="/qr-code" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}><QRCodePage /></ProtectedRoute>
        } />

        {/* Super Admin Only Route */}
        <Route path="/kelola-admin" element={
          <ProtectedRoute allowedRoles={['super_admin']}><KelolaAdminPage /></ProtectedRoute>
        } />

        {/* ═══ Siswa Routes (Green Theme — Public, Tanpa Login) ═══ */}
        {/* Alur: Scan → Verifikasi ID → Biodata → Dashboard → Pretest → Hasil → Modul → Verifikasi Ulang → Posttest → Hasil Akhir */}
        <Route path="/siswa/scan" element={<ScanBarcodePage />} />
        <Route path="/siswa/verifikasi-id" element={<VerifikasiIDPage />} />
        <Route path="/siswa/biodata" element={<BiodataPage />} />
        <Route path="/siswa/dashboard" element={<SiswaDashboardPage />} />
        <Route path="/siswa/ujian" element={<UjianPage />} />
        <Route path="/siswa/hasil-pretest" element={<HasilSkorPage />} />
        <Route path="/siswa/modul" element={<ModulPembelajaranPage />} />
        <Route path="/siswa/verifikasi-ulang" element={<VerifikasiUlangPage />} />
        <Route path="/siswa/hasil-akhir" element={<HasilAkhirPage />} />

        {/* Redirect /scan ke halaman scan baru */}
        <Route path="/scan" element={<Navigate to="/siswa/scan" replace />} />

      </Routes>
    </Router>
  );
}

export default App;

