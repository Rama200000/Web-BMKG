import { useState } from 'react';
import { ChevronLeft, GraduationCap, Info, ArrowRight, Battery, Wifi, Signal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css';

function DataPenggunaPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    kategoriSekolah: '',
    jurusan: '',
    kelas: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Simpan data diri sementara di localStorage
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
          <span className="time">09.41</span>
          <div className="status-icons">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={16} />
          </div>
        </div>

        {/* Header */}
        <header className="mobile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <div className="app-title">
            <div className="app-logo-bg">
              <GraduationCap size={16} color="#000" />
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
          <h1 className="page-title">Data Pengguna</h1>
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
                <select 
                  name="kategoriSekolah"
                  value={formData.kategoriSekolah}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>Pilih kategori sekolah</option>
                  <option value="SMA">SMA</option>
                  <option value="SMK">SMK</option>
                  <option value="MA">MA</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Jurusan <span className="required">*</span></label>
              <div className="select-wrapper">
                <select 
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>Pilih jurusan</option>
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                  <option value="RPL">RPL (Rekayasa Perangkat Lunak)</option>
                  <option value="TKJ">TKJ (Teknik Komputer Jaringan)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Kelas <span className="required">*</span></label>
              <div className="select-wrapper">
                <select 
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>Pilih kelas</option>
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>
            </div>

            {/* Info Box */}
            <div className="info-box">
              <Info size={18} className="info-icon" />
              <p>Informasi ini akan terhubung langsung dengan riwayat nilai dan asesmen pretest Anda.</p>
            </div>

            {/* Submit Button */}
            <div className="submit-section">
              <button type="submit" className="submit-btn">
                Lanjut ke Pretest
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Home Indicator */}
        <div className="home-indicator">
          <div className="indicator-line"></div>
        </div>
      </div>
    </div>
  );
}

export default DataPenggunaPage;
