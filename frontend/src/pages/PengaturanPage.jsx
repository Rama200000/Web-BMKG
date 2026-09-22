import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  History,
  HelpCircle,
  Timer,
  Calendar,
  Info,
  Lock,
  Shuffle,
  ListOrdered,
  Eye,
  CheckCircle2,
  Hourglass,
  ShieldCheck,
  Save
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './PengaturanPage.css';

function PengaturanPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`pengaturan-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="pengaturan-main">
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
              <div className="profile-avatar">A</div>
              <div className="profile-info">
                <span className="profile-name">Admin</span>
                <span className="profile-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="pengaturan-content">
          
          {/* Header */}
          <div className="pg-header-wrapper">
            <div className="pg-breadcrumb">
              <Link to="/dashboard" className="pg-breadcrumb-link">Dashboard</Link>
              <ChevronRight size={14} />
              <Link to="/pengaturan" className="pg-breadcrumb-link">Pengaturan</Link>
              <ChevronRight size={14} />
              <span className="pg-breadcrumb-active">Waktu Pengerjaan</span>
            </div>
            
            <div className="pg-title-row">
              <div className="pg-title-left">
                <h1 className="pg-title">Atur Waktu Pengerjaan Soal</h1>
                <span className="pg-badge">Sesi Ujian Aktif</span>
              </div>
              <div className="pg-title-actions">
                <button className="btn-log-audit">
                  <History size={16} /> Log Audit
                </button>
                <button className="btn-panduan">
                  <HelpCircle size={16} /> Panduan Pengaturan
                </button>
              </div>
            </div>
          </div>

          <div className="pg-grid">
            
            {/* Left Column (Main Form) */}
            <div className="pg-form-container">
              
              <div className="pg-form-header">
                <div className="pg-form-header-left">
                  <div className="pg-header-icon">
                    <Timer size={24} />
                  </div>
                  <div className="pg-header-text">
                    <h3>Pengaturan Waktu & Ujian</h3>
                    <p>Konfigurasi batasan waktu jadwal ujian serta mekanisme keamanan sesi otomatis.</p>
                  </div>
                </div>
                <button className="btn-sinkron">
                  Sinkron Server NTP
                </button>
              </div>

              <div className="pg-form-body">
                
                <div className="pg-section-title">
                  <span>PARAMETER WAKTU SESI</span>
                  <span className="pg-section-meta">Zona Waktu: Asia/Jakarta (WIB)</span>
                </div>

                <div className="pg-row">
                  <div className="pg-group">
                    <label className="pg-label">Durasi Pengerjaan (menit)</label>
                    <div className="pg-input-wrapper">
                      <input type="text" className="pg-input with-suffix" defaultValue="60" />
                      <span className="pg-input-suffix">Mnt</span>
                    </div>
                    <span className="pg-help-text">Durasi countdown siswa saat tes.</span>
                  </div>
                  <div className="pg-group">
                    <label className="pg-label">Mulai Pengerjaan</label>
                    <div className="pg-input-wrapper">
                      <Calendar size={16} />
                      <input type="text" className="pg-input with-icon" defaultValue="2025-07-12 08:00" />
                    </div>
                    <span className="pg-help-text">Waktu pembukaan portal ujian.</span>
                  </div>
                  <div className="pg-group">
                    <label className="pg-label">Selesai Pengerjaan</label>
                    <div className="pg-input-wrapper">
                      <Calendar size={16} />
                      <input type="text" className="pg-input with-icon" defaultValue="2025-07-12 09:00" />
                    </div>
                    <span className="pg-help-text">Batas akhir pengumpulan jawaban.</span>
                  </div>
                </div>

                <div className="pg-alert-info">
                  <Info size={18} className="pg-alert-icon" />
                  <p className="pg-alert-text">
                    Jika durasi pengerjaan diisi <strong>60 menit</strong> dan siswa mulai pukul 08:15 WIB, batas pengerjaan tetap terkunci otomatis tepat pada <strong>09:00 WIB</strong> mengikuti jam selesai global pengerjaan.
                  </p>
                </div>

                <div className="pg-section-title">
                  <span>KEBIJAKAN SISTEM & KEAMANAN SESI</span>
                  <span className="pg-section-meta green">
                    <CheckCircle2 size={14} /> Standar Proctored CBT
                  </span>
                </div>

                <div className="pg-policy-list">
                  <div className="pg-policy-card">
                    <div className="pg-policy-icon">
                      <Lock size={18} />
                    </div>
                    <div className="pg-policy-text">
                      <h4>Kunci Otomatis saat Waktu Habis</h4>
                      <p>Sistem mengunci layar dan mengirim jawaban secara paksa saat timer mencapai 00:00:00.</p>
                    </div>
                  </div>
                  <div className="pg-policy-card">
                    <div className="pg-policy-icon">
                      <Shuffle size={18} />
                    </div>
                    <div className="pg-policy-text">
                      <h4>Acak Urutan Soal</h4>
                      <p>Mendistribusikan urutan nomor soal yang berbeda untuk setiap akun siswa ujian.</p>
                    </div>
                  </div>
                  <div className="pg-policy-card">
                    <div className="pg-policy-icon">
                      <ListOrdered size={18} />
                    </div>
                    <div className="pg-policy-text">
                      <h4>Acak Pilihan Ganda (A-D)</h4>
                      <p>Mengocok posisi pilihan opsi jawaban pada butir soal objektif.</p>
                    </div>
                  </div>
                  <div className="pg-policy-card">
                    <div className="pg-policy-icon">
                      <Eye size={18} />
                    </div>
                    <div className="pg-policy-text">
                      <h4>Tampilkan Hasil Skor Langsung ke Siswa</h4>
                      <p>Perlihatkan kalkulasi nilai dan ringkasan benar/salah segera setelah tombol selesai diklik.</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="pg-form-footer">
                <button className="btn-batal">Batal</button>
                <button className="btn-simpan">
                  <Save size={16} /> Simpan
                </button>
              </div>

            </div>

            {/* Right Column (Sidebar Cards) */}
            <div className="pg-sidebar">
              
              <div className="pg-side-card">
                <div className="pg-side-header">
                  <div className="pg-side-title">
                    <Eye size={18} color="#2563eb" />
                    <span>Preview Sesi Siswa</span>
                  </div>
                  <span className="pg-side-badge">Live Monitor</span>
                </div>

                <div className="pg-timer-box">
                  <div className="pg-timer-left">
                    <div className="pg-timer-icon">
                      <Hourglass size={20} />
                    </div>
                    <div className="pg-timer-text">
                      <span className="pg-timer-label">SISA TOLERANSI MASUK</span>
                      <span className="pg-timer-value">00:15:00</span>
                    </div>
                  </div>
                  <CheckCircle2 size={20} className="pg-timer-check" />
                </div>

                <div className="pg-side-list">
                  <div className="pg-side-item">
                    <span className="pg-item-label">Siswa Terdaftar</span>
                    <span className="pg-item-value">184 Peserta</span>
                  </div>
                  <div className="pg-side-item">
                    <span className="pg-item-label">Kapasitas Sesi Lab</span>
                    <span className="pg-item-value">Lab A, Lab B (200 PC)</span>
                  </div>
                  <div className="pg-side-item">
                    <span className="pg-item-label">Token Akses CBT</span>
                    <span className="pg-item-value badge">EDU-7842</span>
                  </div>
                </div>
              </div>

              <div className="pg-side-card">
                <div className="pg-side-header" style={{ marginBottom: 12 }}>
                  <div className="pg-side-title">
                    <ShieldCheck size={18} color="#10b981" />
                    <span>Validasi Integritas</span>
                  </div>
                </div>
                
                <p className="pg-side-desc">
                  Perubahan waktu ujian akan langsung dikirim ke seluruh workstation siswa yang sedang terhubung melalui WebSocket real-time tanpa perlu refresh browser.
                </p>

                <div className="pg-progress-bar">
                  <div className="pg-progress-fill"></div>
                </div>
                
                <div className="pg-status-row">
                  <span className="pg-status-label">Status Node Server: Normal</span>
                  <span className="pg-status-value">Latensi 18ms</span>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default PengaturanPage;
