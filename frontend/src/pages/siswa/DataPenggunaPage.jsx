import { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, Info, ArrowRight, Battery, Wifi, Signal, User, BookOpen, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

function DataPenggunaPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nama: '', kategoriSekolah: '', jurusan: '', kelas: '' });
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newStudent = {
      id: Date.now(),
      nama: formData.nama,
      sekolah: formData.kategoriSekolah,
      jurusan: formData.jurusan,
      kelas: formData.kelas,
      tanggal: new Date().toISOString()
    };
    localStorage.setItem('currentStudent', JSON.stringify(newStudent));
    navigate('/siswa/pretest-intro');
  };

  return (
    <div className="mobile-app-container">
      <div className="mobile-screen">
        {/* Status Bar */}
        <div className="status-bar">
          <span className="time">{currentTime}</span>
          <div className="status-icons">
            <Signal size={13} />
            <Wifi size={13} />
            <Battery size={15} />
          </div>
        </div>

        {/* Header */}
        <header className="mobile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} />
          </button>
          <div className="app-title">
            <div className="app-logo-bg">
              <GraduationCap size={16} color="#1d4ed8" />
            </div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="badge-portal">
            <div className="dot"></div>
            Portal Siswa
          </div>
        </header>

        {/* Progress */}
        <div className="progress-section">
          <div className="progress-text">
            <span className="step-count">Langkah 1 dari 4</span>
            <span className="step-name">Data Pengguna</span>
          </div>
          <div className="progress-bars">
            <div className="bar active"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="form-content">
          {/* Page Header with icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              <User size={18} color="#1d4ed8" />
            </div>
            <h1 className="page-title">Data Pengguna</h1>
          </div>
          <p className="page-subtitle">Lengkapi data diri sebelum memulai pretest.</p>

          <form onSubmit={handleNext}>
            <div className="form-group">
              <label>Nama Lengkap <span className="required">*</span></label>
              <input
                type="text"
                name="nama"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Kategori Sekolah <span className="required">*</span></label>
              <div className="select-wrapper">
                <select name="kategoriSekolah" value={formData.kategoriSekolah} onChange={handleChange} required>
                  <option value="" disabled hidden>Pilih kategori sekolah</option>
                  <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                  <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                  <option value="MA">MA (Madrasah Aliyah)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Jurusan <span className="required">*</span></label>
              <div className="select-wrapper">
                <select name="jurusan" value={formData.jurusan} onChange={handleChange} required>
                  <option value="" disabled hidden>Pilih jurusan</option>
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                  <option value="RPL">RPL (Rekayasa Perangkat Lunak)</option>
                  <option value="TKJ">TKJ (Teknik Komputer Jaringan)</option>
                  <option value="Bahasa">Bahasa</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Kelas <span className="required">*</span></label>
              <div className="select-wrapper">
                <select name="kelas" value={formData.kelas} onChange={handleChange} required>
                  <option value="" disabled hidden>Pilih kelas</option>
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>
            </div>

            {/* Info Box */}
            <div className="info-box">
              <Info size={16} className="info-icon" />
              <p>Informasi ini akan terhubung langsung dengan riwayat nilai dan asesmen pretest Anda.</p>
            </div>

            {/* Submit */}
            <div className="submit-section">
              <button type="submit" className="submit-btn">
                Lanjut ke Pretest
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>
      </div>
    </div>
  );
}

export default DataPenggunaPage;
