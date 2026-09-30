import { useState, useEffect } from 'react';
import { Leaf, FileText, BookOpen, Award, Lock, ChevronRight, CheckCircle2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './mobile-green-theme.css';
import './SiswaDashboardPage.css';

function SiswaDashboardPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [pretestDone, setPretestDone] = useState(false);
  const [modulDone, setModulDone] = useState(false);
  const [posttestDone, setPosttestDone] = useState(false);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Load unlock states
    setPretestDone(localStorage.getItem('pretestDone') === 'true');
    setModulDone(localStorage.getItem('modulDone') === 'true');
    setPosttestDone(localStorage.getItem('skorPosttest') !== null);
    // Load student data
    const s = localStorage.getItem('currentStudent');
    if (s) setStudent(JSON.parse(s));
  }, []);

  const handleCardClick = (type) => {
    if (type === 'pretest') {
      if (pretestDone) navigate('/siswa/hasil-pretest');
      else navigate('/siswa/ujian?mode=pretest');
    } else if (type === 'modul' && pretestDone) {
      navigate('/siswa/modul');
    } else if (type === 'posttest' && modulDone) {
      if (posttestDone) navigate('/siswa/hasil-akhir');
      else navigate('/siswa/verifikasi-ulang');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('siswaPhone');
    localStorage.removeItem('currentStudent');
    localStorage.removeItem('pretestDone');
    localStorage.removeItem('modulDone');
    localStorage.removeItem('skorPretest');
    localStorage.removeItem('skorPosttest');
    localStorage.removeItem('pretestTime');
    localStorage.removeItem('posttestTime');
    navigate('/siswa/scan');
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 15) return 'Selamat Siang';
    if (h < 18) return 'Selamat Sore';
    return 'Selamat Malam';
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

        {/* Dashboard Header */}
        <div className="dash-header">
          <div className="dash-header-top">
            <div className="m-app-title">
              <div className="m-app-logo"><Leaf size={16} color="#059669" /></div>
              <span>Si Iklim Muda</span>
            </div>
            <button className="dash-logout" onClick={handleLogout}>
              <LogOut size={16} />
            </button>
          </div>
          <div className="dash-welcome">
            <div className="dash-avatar">{student?.nama?.charAt(0)?.toUpperCase() || 'S'}</div>
            <div>
              <p className="dash-greeting">{getGreeting()} 👋</p>
              <h2 className="dash-name">{student?.nama || 'Siswa'}</h2>
              <p className="dash-school">{student?.sekolah || ''} • Kelas {student?.kelas || ''}</p>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="dash-progress-summary">
          <div className="dash-progress-item completed">
            <CheckCircle2 size={14} />
            <span>Registrasi</span>
          </div>
          <div className="dash-progress-divider"></div>
          <div className={`dash-progress-item ${pretestDone ? 'completed' : 'current'}`}>
            {pretestDone ? <CheckCircle2 size={14} /> : <div className="dash-progress-dot"></div>}
            <span>Pretest</span>
          </div>
          <div className="dash-progress-divider"></div>
          <div className={`dash-progress-item ${modulDone ? 'completed' : pretestDone ? 'current' : ''}`}>
            {modulDone ? <CheckCircle2 size={14} /> : <div className="dash-progress-dot"></div>}
            <span>Modul</span>
          </div>
          <div className="dash-progress-divider"></div>
          <div className="dash-progress-divider"></div>
          <div className={`dash-progress-item ${posttestDone ? 'completed' : modulDone ? 'current' : ''}`}>
            {posttestDone ? <CheckCircle2 size={14} /> : <div className="dash-progress-dot"></div>}
            <span>Posttest</span>
          </div>
        </div>

        <div className="m-body" style={{ paddingTop: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: '0 0 14px 0' }}>
            📚 Menu Pembelajaran
          </h3>

          {/* Card: Pretest */}
          <div
            className={`dash-card ${pretestDone ? 'done' : 'active'}`}
            onClick={() => handleCardClick('pretest')}
            style={{ cursor: 'pointer' }}
          >
            <div className="dash-card-icon green">
              <FileText size={22} />
            </div>
            <div className="dash-card-info">
              <h4>Pretest</h4>
              <p>{pretestDone ? 'Sudah dikerjakan ✓ (Lihat Hasil)' : 'Uji pengetahuan awal kamu'}</p>
            </div>
            <div className="dash-card-action">
              {pretestDone ? (
                <span className="dash-badge done"><CheckCircle2 size={14} /> Selesai</span>
              ) : (
                <span className="dash-badge open">Mulai <ChevronRight size={14} /></span>
              )}
            </div>
          </div>

          {/* Card: Modul */}
          <div
            className={`dash-card ${modulDone ? 'done' : pretestDone ? 'active' : 'locked'}`}
            onClick={() => pretestDone && handleCardClick('modul')}
            style={{ cursor: pretestDone ? 'pointer' : 'default' }}
          >
            <div className={`dash-card-icon ${pretestDone ? 'green' : 'gray'}`}>
              {pretestDone ? <BookOpen size={22} /> : <Lock size={22} />}
            </div>
            <div className="dash-card-info">
              <h4>{pretestDone ? 'Modul Pembelajaran' : '🔒 Modul Pembelajaran'}</h4>
              <p>{modulDone ? 'Sudah dipelajari ✓ (Baca Lagi)' : pretestDone ? 'Pelajari materi iklim' : 'Selesaikan Pretest terlebih dahulu'}</p>
            </div>
            <div className="dash-card-action">
              {modulDone ? (
                <span className="dash-badge done"><CheckCircle2 size={14} /> Selesai</span>
              ) : pretestDone ? (
                <span className="dash-badge open">Buka <ChevronRight size={14} /></span>
              ) : (
                <span className="dash-badge locked"><Lock size={12} /> Terkunci</span>
              )}
            </div>
          </div>

          {/* Card: Posttest */}
          <div
            className={`dash-card ${posttestDone ? 'done' : modulDone ? 'active' : 'locked'}`}
            onClick={() => modulDone && handleCardClick('posttest')}
            style={{ cursor: modulDone ? 'pointer' : 'default' }}
          >
            <div className={`dash-card-icon ${posttestDone || modulDone ? 'green' : 'gray'}`}>
              {posttestDone || modulDone ? <Award size={22} /> : <Lock size={22} />}
            </div>
            <div className="dash-card-info">
              <h4>{modulDone ? 'Posttest' : '🔒 Posttest'}</h4>
              <p>{posttestDone ? 'Sudah dikerjakan ✓ (Lihat Hasil)' : modulDone ? 'Uji pemahaman akhir' : 'Selesaikan Modul terlebih dahulu'}</p>
            </div>
            <div className="dash-card-action">
              {posttestDone ? (
                <span className="dash-badge done"><CheckCircle2 size={14} /> Selesai</span>
              ) : modulDone ? (
                <span className="dash-badge open">Mulai <ChevronRight size={14} /></span>
              ) : (
                <span className="dash-badge locked"><Lock size={12} /> Terkunci</span>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="m-info-box" style={{ marginTop: 20 }}>
            <Leaf size={16} className="m-info-icon" />
            <p>Ikuti alur pembelajaran secara berurutan: <strong>Pretest → Modul → Posttest</strong> untuk hasil terbaik.</p>
          </div>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default SiswaDashboardPage;
