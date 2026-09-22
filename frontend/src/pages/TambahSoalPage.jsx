import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  Save,
  ArrowLeft
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './TambahSoalPage.css';

function TambahSoalPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [tipeSoal, setTipeSoal] = useState('pilihan_ganda');

  return (
    <div className={`tambah-soal-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="tambah-soal-main">
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
        <div className="tambah-soal-content">
          
          {/* Header */}
          <div className="ts-header-wrapper">
            <div className="ts-breadcrumb">
              <Link to="/dashboard" className="ts-breadcrumb-link">Dashboard</Link>
              <ChevronRight size={14} />
              <Link to="/soal" className="ts-breadcrumb-link">Soal</Link>
              <ChevronRight size={14} />
              <span className="ts-breadcrumb-active">Tambah Soal</span>
            </div>
            
            <div className="ts-title-row">
              <div className="ts-title-left">
                <h1 className="ts-title">Tambah Butir Soal Baru</h1>
              </div>
              <div className="ts-title-actions">
                <button className="btn-batal-header" onClick={() => navigate('/soal')}>
                  <ArrowLeft size={16} />
                  Kembali ke Manajemen Soal
                </button>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="ts-card">
            
            <div className="ts-card-header">
              <div className="ts-icon-wrapper">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3>Editor Parameter & Format Jawaban</h3>
                <p>Isi form di bawah untuk menambahkan soal baru ke bank soal modul.</p>
              </div>
            </div>

            <div className="ts-form-row">
              <div className="ts-form-group">
                <label className="ts-label">Pilih Modul <span>*</span></label>
                <select className="ts-input">
                  <option>Dasar Pemrograman (TK-101)</option>
                  <option>Web Development (WD-201)</option>
                  <option>Basis Data (BD-301)</option>
                </select>
              </div>

              <div className="ts-form-group">
                <label className="ts-label">Tipe Soal <span>*</span></label>
                <div className="ts-type-toggle">
                  <label className={`ts-type-radio ${tipeSoal === 'pilihan_ganda' ? 'active' : ''}`}>
                    <input type="radio" name="tipe_soal" checked={tipeSoal === 'pilihan_ganda'} onChange={() => setTipeSoal('pilihan_ganda')} />
                    <span className="ts-type-text">Pilihan Ganda</span>
                  </label>
                  <label className={`ts-type-radio ${tipeSoal === 'essay' ? 'active' : ''}`}>
                    <input type="radio" name="tipe_soal" checked={tipeSoal === 'essay'} onChange={() => setTipeSoal('essay')} />
                    <span className="ts-type-text">Essay</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="ts-form-group">
              <label className="ts-label">
                <span>Pertanyaan *</span>
                <span className="ts-label-hint">Format Markdown didukung</span>
              </label>
              <textarea className="ts-input" placeholder="Tuliskan pertanyaan Anda di sini..."></textarea>
            </div>

            {tipeSoal === 'pilihan_ganda' && (
              <>
                <div className="ts-form-group">
                  <label className="ts-label">Pilihan Jawaban <span>*</span></label>
                  <div className="ts-options-grid">
                    <div className="ts-option-row">
                      <div className="ts-option-label">A</div>
                      <input type="text" className="ts-input" placeholder="Opsi A" />
                    </div>
                    <div className="ts-option-row">
                      <div className="ts-option-label">B</div>
                      <input type="text" className="ts-input" placeholder="Opsi B" />
                    </div>
                    <div className="ts-option-row">
                      <div className="ts-option-label">C</div>
                      <input type="text" className="ts-input" placeholder="Opsi C" />
                    </div>
                    <div className="ts-option-row">
                      <div className="ts-option-label">D</div>
                      <input type="text" className="ts-input" placeholder="Opsi D" />
                    </div>
                  </div>
                </div>

                <div className="ts-form-group" style={{ marginBottom: 0 }}>
                  <label className="ts-label" style={{ justifyContent: 'flex-start', gap: 8 }}>
                    Jawaban Benar / Kunci <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
                  </label>
                  <select className="ts-input success" style={{ maxWidth: 400 }}>
                    <option value="">-- Pilih Kunci Jawaban --</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </>
            )}

            {tipeSoal === 'essay' && (
              <div className="ts-form-group" style={{ marginBottom: 0 }}>
                <label className="ts-label">Panduan Jawaban Benar (Kunci)</label>
                <textarea className="ts-input" placeholder="Tuliskan poin-poin penting yang harus ada dalam jawaban siswa..." style={{ minHeight: 150 }}></textarea>
              </div>
            )}

          </div>
          
        </div>

        {/* Fixed Footer Bar */}
        <div className="ts-footer-bar">
          <button className="btn-batal-footer" onClick={() => navigate('/soal')}>Batal</button>
          <button className="btn-simpan-soal">
            <Save size={16} />
            Simpan Soal ke Bank Data
          </button>
        </div>

      </div>
    </div>
  );
}

export default TambahSoalPage;
