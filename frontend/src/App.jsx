import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DataSiswaPage from './pages/DataSiswaPage';
import ModulPage from './pages/ModulPage';
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
      </Routes>
    </Router>
  );
}

export default App;
