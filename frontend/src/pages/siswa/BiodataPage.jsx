import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, GraduationCap, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './BiodataPage.css';

// Daftar sementara (sama dengan data contoh di dashboard admin).
// Ganti dengan data dari backend setelah fitur kelola sekolah tersedia.
const SEKOLAH_OPTIONS = [
  'SMA 3 Bandung',
  'SMAN 1 Cimahi',
  'SMAN 4 Cimahi',
  'SMKN 1 Bandung',
  'SMKN 2 Bandung',
];

const JURUSAN_OPTIONS = [
  { value: 'IPA', label: 'IPA' },
  { value: 'IPS', label: 'IPS' },
  { value: 'RPL', label: 'RPL (Rekayasa Perangkat Lunak)' },
  { value: 'TKJ', label: 'TKJ (Teknik Komputer Jaringan)' },
  { value: 'Bahasa', label: 'Bahasa' },
];

const KELAS_OPTIONS = [
  { value: 'X', label: 'Kelas X' },
  { value: 'XI', label: 'Kelas XI' },
  { value: 'XII', label: 'Kelas XII' },
];

function SelectField({ id, name, label, placeholder, value, onChange, options }) {
  return (
    <div className="bio-field">
      <label className="bio-label" htmlFor={id}>{label} <span className="req">*</span></label>
      <div className="bio-select-wrap">
        <select
          id={id}
          name={name}
          className={`bio-input bio-select${value ? '' : ' empty'}`}
          value={value}
          onChange={onChange}
          required
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((opt) => {
            const { value: v, label: l } = typeof opt === 'string' ? { value: opt, label: opt } : opt;
            return <option key={v} value={v}>{l}</option>;
          })}
        </select>
        <ChevronDown size={18} className="bio-select-icon" />
      </div>
    </div>
  );
}

function BiodataPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    sekolah: '',
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

  const isValid = formData.nama.trim() && formData.sekolah && formData.jurusan && formData.kelas;

  const handleSubmit = (e) => {
    e.preventDefault();
    const phone = localStorage.getItem('siswaPhone') || '';
    const student = {
      id: Date.now(),
      nama: formData.nama.trim(),
      sekolah: formData.sekolah,
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
      <div className="m-screen nv-page">
        <div className="m-statusbar">
          <span>{currentTime}</span>
          <div className="m-statusbar-icons">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="10" x2="23" y2="14"/></svg>
          </div>
        </div>

        {/* Header */}
        <header className="m-header nv-header">
          <button type="button" className="nv-back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
            <ChevronLeft size={18} />
          </button>
          <div className="m-app-title">
            <div className="nv-logo"><GraduationCap size={16} strokeWidth={2} /></div>
            <span>Si Iklim Muda</span>
          </div>
          <div className="nv-badge"><div className="nv-badge-dot"></div> Siswa</div>
        </header>

        {/* Body */}
        <div className="m-body nv-body bio-body">
          <h1 className="bio-title">Data Pengguna</h1>
          <p className="bio-subtitle">Lengkapi data diri sebelum memulai pretest.</p>

          <form className="bio-form" onSubmit={handleSubmit}>
            <div className="bio-field">
              <label className="bio-label" htmlFor="bio-nama">Nama Lengkap <span className="req">*</span></label>
              <input
                id="bio-nama"
                className="bio-input"
                type="text"
                name="nama"
                autoComplete="name"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>

            <SelectField
              id="bio-sekolah"
              name="sekolah"
              label="Nama Sekolah"
              placeholder="Pilih nama sekolah"
              value={formData.sekolah}
              onChange={handleChange}
              options={SEKOLAH_OPTIONS}
            />

            <SelectField
              id="bio-jurusan"
              name="jurusan"
              label="Jurusan"
              placeholder="Pilih jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              options={JURUSAN_OPTIONS}
            />

            <SelectField
              id="bio-kelas"
              name="kelas"
              label="Kelas"
              placeholder="Pilih kelas"
              value={formData.kelas}
              onChange={handleChange}
              options={KELAS_OPTIONS}
            />

            <div className="bio-info">
              <Info size={16} className="bio-info-icon" />
              <p>Informasi ini akan terhubung langsung dengan riwayat nilai dan asesmen pretest Anda.</p>
            </div>

            <div className="nv-footer">
              <button type="submit" className="nv-btn" disabled={!isValid}>
                Lanjut ke Pretest <ArrowRight size={18} />
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
