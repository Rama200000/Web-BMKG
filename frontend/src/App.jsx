import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DataSiswaPage from './pages/DataSiswaPage';
import ModulPage from './pages/ModulPage';
import TambahModulPage from './pages/TambahModulPage';
import SoalPage from './pages/SoalPage';
import TambahSoalPage from './pages/TambahSoalPage';
import HasilSkorPage from './pages/HasilSkorPage';
import PengaturanPage from './pages/PengaturanPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Redirect root ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Nanti tambahkan route lain di sini */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/data-siswa" element={<DataSiswaPage />} />
        <Route path="/modul" element={<ModulPage />} />
        <Route path="/tambah-modul" element={<TambahModulPage />} />
        <Route path="/soal" element={<SoalPage />} />
        <Route path="/tambah-soal" element={<TambahSoalPage />} />
        <Route path="/hasil-skor" element={<HasilSkorPage />} />
        <Route path="/pengaturan" element={<PengaturanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
