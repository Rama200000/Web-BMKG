import { useState, useEffect } from 'react';
import { ChevronLeft, Leaf, User, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './mobile-green-theme.css';

function BiodataPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    kategoriSekolah: '',
    jurusan: '',
    kelas: ''
  });
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

  const isValid = formData.nama && formData.kategoriSekolah && formData.jurusan && formData.kelas;

  const handleSubmit = (e) => {
    e.preventDefault();
    const phone = localStorage.getItem('siswaPhone') || '';
    const student = {
      id: Date.now(),
      nama: formData.nama,
      sekolah: formData.kategoriSekolah,
      jurusan: formData.jurusan,
      kelas: formData.kelas,
      phone: phone,
      tanggal: new Date().toISOString(),
      pretestDone: false,
      modulDone: false,
      skorPretest: null,
      skorPosttest: null
    };
    localStorage.setItem('currentStudent', JSON.stringify(student));

    // Register user in shared registry (keyed by phone) for session recovery
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    users[phone] = student;
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    navigate('/siswa/dashboard');
  };

  return (
    <div className="m-app">
      <div className="m-screen">
        <div className="m-statusbar">
          <span>{currentTime}</span>
          <div className="m-statusbar-icons">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="10" x2="23" y2="14"/></svg>
          </div>
        </div>

        <header className="m-header">
          <button className="m-back-btn" onClick={() => navigate(-1)}><ChevronLeft size={18} /></button>
          <div className="m-app-title">
            <div className="m-app-logo"><Leaf size={16} color="#059669" /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="m-badge"><div className="m-badge-dot"></div> Portal Siswa</div>
        </header>

        <div className="m-progress">
          <div className="m-progress-text">
            <span className="m-progress-step">Langkah 2 dari 4</span>
            <span className="m-progress-label">Data Diri</span>
          </div>
          <div className="m-progress-bars">
            <div className="m-progress-bar active"></div>
            <div className="m-progress-bar active"></div>
            <div className="m-progress-bar"></div>
            <div className="m-progress-bar"></div>
          </div>
        </div>

        <div className="m-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div className="m-icon-circle green"><User size={20} /></div>
            <h1 className="m-title" style={{ fontSize: 22 }}>Biodata Diri</h1>
          </div>
          <p className="m-subtitle">Lengkapi data diri kamu untuk memulai sesi pembelajaran.</p>

          <form onSubmit={handleSubmit}>
            <div className="m-form-group">
              <label className="m-label">Nama Lengkap <span className="req">*</span></label>
              <input
                className="m-input"
                type="text"
                name="nama"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="m-form-group">
              <label className="m-label">Kategori Sekolah <span className="req">*</span></label>
              <div className="m-select-wrap">
                <select className="m-select" name="kategoriSekolah" value={formData.kategoriSekolah} onChange={handleChange} required>
                  <option value="" disabled hidden>Pilih kategori sekolah</option>
                  <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                  <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                  <option value="MA">MA (Madrasah Aliyah)</option>
                </select>
              </div>
            </div>

            <div className="m-form-group">
              <label className="m-label">Jurusan <span className="req">*</span></label>
              <div className="m-select-wrap">
                <select className="m-select" name="jurusan" value={formData.jurusan} onChange={handleChange} required>
                  <option value="" disabled hidden>Pilih jurusan</option>
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                  <option value="RPL">RPL (Rekayasa Perangkat Lunak)</option>
                  <option value="TKJ">TKJ (Teknik Komputer Jaringan)</option>
                  <option value="Bahasa">Bahasa</option>
                </select>
              </div>
            </div>

            <div className="m-form-group">
              <label className="m-label">Kelas <span className="req">*</span></label>
              <div className="m-select-wrap">
                <select className="m-select" name="kelas" value={formData.kelas} onChange={handleChange} required>
                  <option value="" disabled hidden>Pilih kelas</option>
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>
            </div>

            <div className="m-info-box">
              <Info size={16} className="m-info-icon" />
              <p>Data ini akan terhubung dengan riwayat nilai dan asesmen Anda selama program berlangsung.</p>
            </div>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="m-btn-primary" disabled={!isValid}>
                Simpan & Lanjut
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default BiodataPage;
