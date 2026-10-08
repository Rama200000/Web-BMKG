import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import DataSiswaPage from './pages/admin/DataSiswaPage';
import ModulPage from './pages/admin/ModulPage';
import TambahModulPage from './pages/admin/TambahModulPage';
import EditModulPage from './pages/admin/EditModulPage';
import SoalPage from './pages/admin/SoalPage';
import TambahSoalPage from './pages/admin/TambahSoalPage';
import HasilSkorPageAdmin from './pages/admin/HasilSkorPage';
import DetailSkorPage from './pages/admin/DetailSkorPage';
import LeaderboardPage from './pages/admin/LeaderboardPage';
import PengaturanPage from './pages/admin/PengaturanPage';
import PengaturanSekolahPage from './pages/admin/PengaturanSekolahPage';
import KelolaAdminPage from './pages/admin/KelolaAdminPage';
import QRCodePage from './pages/admin/QRCodePage';

// ─── Siswa: Halaman Baru (Green Theme) ───
import ScanBarcodePage from './pages/siswa/ScanBarcodePage';
import VerifikasiIDPage from './pages/siswa/VerifikasiIDPage';
import BiodataPage from './pages/siswa/BiodataPage';
import SiswaDashboardPage from './pages/siswa/SiswaDashboardPage';
import PretestIntroPage from './pages/siswa/PretestIntroPage';
import UjianPage from './pages/siswa/UjianPage';
import HasilSkorPage from './pages/siswa/HasilSkorPage';
import PretestSelesaiPage from './pages/siswa/PretestSelesaiPage';
import ModulPembelajaranPage from './pages/siswa/ModulPembelajaranPage';
import PeringkatPage from './pages/siswa/PeringkatPage';
import RiwayatUjianPage from './pages/siswa/RiwayatUjianPage';

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
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/data-siswa" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><DataSiswaPage /></ProtectedRoute>
        } />
        <Route path="/pengaturan-sekolah" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><PengaturanSekolahPage /></ProtectedRoute>
        } />
        <Route path="/modul" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><ModulPage /></ProtectedRoute>
        } />
        <Route path="/tambah-modul" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><TambahModulPage /></ProtectedRoute>
        } />
        <Route path="/edit-modul/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><EditModulPage /></ProtectedRoute>
        } />
        <Route path="/soal" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><SoalPage /></ProtectedRoute>
        } />
        <Route path="/tambah-soal" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><TambahSoalPage /></ProtectedRoute>
        } />
        <Route path="/hasil-skor" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><HasilSkorPageAdmin /></ProtectedRoute>
        } />
        <Route path="/hasil-skor/detail" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><DetailSkorPage /></ProtectedRoute>
        } />
        <Route path="/hasil-skor/leaderboard" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><LeaderboardPage /></ProtectedRoute>
        } />
        <Route path="/pengaturan" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><PengaturanPage /></ProtectedRoute>
        } />
        
        <Route path="/qr-code" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}><QRCodePage /></ProtectedRoute>
        } />

        {/* Super Admin Only Route */}
        <Route path="/kelola-admin" element={
          <ProtectedRoute allowedRoles={['superadmin']}><KelolaAdminPage /></ProtectedRoute>
        } />

        {/* ═══ Siswa Routes (Green Theme — Public, Tanpa Login) ═══ */}
        {/* Alur: Scan → Verifikasi ID → Biodata → Dashboard → Info Pretest → Pretest → Hasil → Pretest Selesai → Modul → Scan → Verifikasi ID → Info Posttest → Posttest → Hasil Posttest → Posttest Selesai → Peringkat → Dashboard */}
        <Route path="/siswa/scan" element={<ScanBarcodePage />} />
        <Route path="/siswa/verifikasi-id" element={<VerifikasiIDPage />} />
        <Route path="/siswa/biodata" element={<BiodataPage />} />
        <Route path="/siswa/dashboard" element={<SiswaDashboardPage />} />
        <Route path="/siswa/pretest-info" element={<PretestIntroPage />} />
        <Route path="/siswa/posttest-info" element={<PretestIntroPage mode="posttest" />} />
        <Route path="/siswa/ujian" element={<UjianPage />} />
        <Route path="/siswa/hasil-pretest" element={<HasilSkorPage />} />
        <Route path="/siswa/pretest-selesai" element={<PretestSelesaiPage />} />
        <Route path="/siswa/modul" element={<ModulPembelajaranPage />} />
        <Route path="/siswa/riwayat" element={<RiwayatUjianPage />} />
        {/* Alamat lama sebelum posttest → alur baru: scan dulu */}
        <Route path="/siswa/verifikasi-ulang" element={<Navigate to="/siswa/scan?untuk=posttest" replace />} />
        <Route path="/siswa/hasil-posttest" element={<HasilSkorPage mode="posttest" />} />
        <Route path="/siswa/posttest-selesai" element={<PretestSelesaiPage mode="posttest" />} />
        <Route path="/siswa/peringkat" element={<PeringkatPage />} />
        {/* Alamat lama hasil posttest → alur hasil yang baru */}
        <Route path="/siswa/hasil-akhir" element={<Navigate to="/siswa/hasil-posttest" replace />} />

        {/* Redirect /scan ke halaman scan baru */}
        <Route path="/scan" element={<Navigate to="/siswa/scan" replace />} />

      </Routes>
    </Router>
  );
}

export default App;

