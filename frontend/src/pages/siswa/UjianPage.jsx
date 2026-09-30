import { useState, useEffect, useCallback } from 'react';
import { Leaf, Clock, ChevronLeft, ChevronRight, Flag, Send, ShieldAlert, Grid3X3, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './mobile-green-theme.css';
import './UjianPage.css';

// ─── Bank Soal (25 soal simulasi) ───
const bankSoal = [
  { id:1, pertanyaan:'Manakah pernyataan yang paling tepat mengenai perubahan iklim global?', pilihan:['Perubahan iklim hanya terjadi di daerah tropis','Peningkatan suhu bumi akibat emisi gas rumah kaca','Perubahan iklim tidak berpengaruh pada curah hujan','Perubahan iklim adalah fenomena alam biasa'], kunci:1 },
  { id:2, pertanyaan:'Apa yang dimaksud dengan efek rumah kaca?', pilihan:['Proses pertanian di dalam rumah kaca','Fenomena memanasnya Bumi akibat gas atmosfer menyerap radiasi inframerah','Penggunaan energi surya untuk rumah tangga','Metode penyimpanan karbon di lautan'], kunci:1 },
  { id:3, pertanyaan:'Gas apakah yang paling banyak berkontribusi terhadap pemanasan global?', pilihan:['Oksigen (O₂)','Nitrogen (N₂)','Karbon Dioksida (CO₂)','Hidrogen (H₂)'], kunci:2 },
  { id:4, pertanyaan:'Apa dampak utama pemanasan global terhadap laut?', pilihan:['Air laut menjadi lebih dingin','Permukaan air laut naik akibat mencairnya es kutub','Jumlah ikan meningkat drastis','Salinitas air laut menurun tajam'], kunci:1 },
  { id:5, pertanyaan:'Organisasi PBB yang menangani isu perubahan iklim adalah...', pilihan:['WHO','UNICEF','IPCC','UNESCO'], kunci:2 },
  { id:6, pertanyaan:'Apa perbedaan utama antara cuaca dan iklim?', pilihan:['Cuaca bersifat jangka pendek, iklim jangka panjang','Keduanya sama saja','Iklim hanya berlaku di kutub','Cuaca tidak dapat berubah'], kunci:0 },
  { id:7, pertanyaan:'Lapisan atmosfer yang melindungi Bumi dari radiasi UV adalah...', pilihan:['Troposfer','Stratosfer (Lapisan Ozon)','Mesosfer','Termosfer'], kunci:1 },
  { id:8, pertanyaan:'Apa yang menyebabkan lubang ozon?', pilihan:['Peningkatan oksigen','Penggunaan CFC dan halokarbon','Peningkatan nitrogen','Penurunan suhu global'], kunci:1 },
  { id:9, pertanyaan:'El Niño adalah fenomena yang terjadi di...', pilihan:['Samudra Atlantik','Samudra Hindia','Samudra Pasifik','Laut Mediterania'], kunci:2 },
  { id:10, pertanyaan:'Dampak El Niño di Indonesia umumnya berupa...', pilihan:['Curah hujan meningkat drastis','Kekeringan berkepanjangan','Suhu menurun drastis','Badai salju'], kunci:1 },
  { id:11, pertanyaan:'Apa yang dimaksud dengan adaptasi perubahan iklim?', pilihan:['Menghentikan semua aktivitas industri','Menyesuaikan diri dengan dampak perubahan iklim','Mengabaikan perubahan iklim','Memindahkan semua penduduk ke kutub'], kunci:1 },
  { id:12, pertanyaan:'Mitigasi perubahan iklim bertujuan untuk...', pilihan:['Meningkatkan emisi gas rumah kaca','Mengurangi penyebab perubahan iklim','Mempercepat pemanasan global','Menghilangkan semua gas di atmosfer'], kunci:1 },
  { id:13, pertanyaan:'Sektor mana yang menyumbang emisi CO₂ terbesar?', pilihan:['Pertanian','Energi dan transportasi','Perikanan','Pariwisata'], kunci:1 },
  { id:14, pertanyaan:'Apa fungsi utama BMKG?', pilihan:['Mengelola keuangan negara','Monitoring meteorologi, klimatologi, dan geofisika','Mengatur lalu lintas udara','Mengelola sumber daya air'], kunci:1 },
  { id:15, pertanyaan:'Alat untuk mengukur curah hujan disebut...', pilihan:['Termometer','Barometer','Penakar hujan (Rain gauge)','Anemometer'], kunci:2 },
  { id:16, pertanyaan:'Apa yang dimaksud dengan carbon footprint?', pilihan:['Jejak kaki di pasir','Total emisi gas rumah kaca yang dihasilkan oleh individu/organisasi','Jenis bahan bakar fosil','Metode pertanian organik'], kunci:1 },
  { id:17, pertanyaan:'Pohon berperan penting dalam mengurangi pemanasan global karena...', pilihan:['Menghasilkan CO₂','Menyerap CO₂ dan menghasilkan O₂','Meningkatkan suhu tanah','Mengurangi curah hujan'], kunci:1 },
  { id:18, pertanyaan:'Energi terbarukan yang paling banyak digunakan di dunia adalah...', pilihan:['Energi nuklir','Energi surya dan angin','Energi batu bara','Energi minyak bumi'], kunci:1 },
  { id:19, pertanyaan:'La Niña umumnya menyebabkan di Indonesia...', pilihan:['Kekeringan panjang','Curah hujan di atas normal','Suhu sangat panas','Gempa bumi'], kunci:1 },
  { id:20, pertanyaan:'Apa yang dimaksud dengan Iklim Muson?', pilihan:['Iklim yang hanya memiliki 1 musim','Iklim dengan pergantian musim hujan dan kemarau akibat angin muson','Iklim di daerah kutub','Iklim tanpa hujan'], kunci:1 },
  { id:21, pertanyaan:'Deforestasi berkontribusi terhadap pemanasan global karena...', pilihan:['Menambah jumlah pohon','Mengurangi penyerapan CO₂ dan melepaskan karbon tersimpan','Menurunkan suhu global','Meningkatkan produksi oksigen'], kunci:1 },
  { id:22, pertanyaan:'Perjanjian internasional tentang perubahan iklim yang ditandatangani tahun 2015 adalah...', pilihan:['Protokol Kyoto','Perjanjian Paris','Perjanjian Montreal','Konvensi Basel'], kunci:1 },
  { id:23, pertanyaan:'Apa dampak kenaikan permukaan air laut?', pilihan:['Daratan bertambah luas','Banjir rob dan tenggelamnya pulau kecil','Suhu laut menurun','Ikan bertambah banyak'], kunci:1 },
  { id:24, pertanyaan:'Indeks Kualitas Udara (AQI) yang menunjukkan "Tidak Sehat" berada pada rentang...', pilihan:['0-50','51-100','101-150','151-200'], kunci:3 },
  { id:25, pertanyaan:'Apa peran generasi muda dalam menghadapi perubahan iklim?', pilihan:['Tidak perlu peduli karena bukan urusan mereka','Aktif dalam edukasi, advokasi, dan aksi nyata pelestarian lingkungan','Hanya mengandalkan pemerintah','Menghindari semua teknologi modern'], kunci:1 },
];

const TIMER_SECONDS = 15 * 60;

function UjianPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'pretest';

  const [soalList, setSoalList] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [jawaban, setJawaban] = useState({}); // { [index]: choiceIndex }
  const [flagged, setFlagged] = useState({}); // { [index]: true }
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [startTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  // Clock & Shuffle Options
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);

    // Shuffle options once on mount
    const shuffle = (array) => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    const preparedSoal = bankSoal.map(s => {
      const options = s.pilihan.map((text, idx) => ({ text, isOriginalKey: idx === s.kunci }));
      return { ...s, pilihanShuffled: shuffle(options) };
    });
    setSoalList(preparedSoal);

    return () => clearInterval(t);
  }, []);

  // Submit handler
  const doSubmit = useCallback(() => {
    if (submitted || soalList.length === 0) return;
    setSubmitted(true);

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    let benar = 0;
    soalList.forEach((soal, i) => {
      const selectedIndex = jawaban[i];
      if (selectedIndex !== undefined && soal.pilihanShuffled[selectedIndex].isOriginalKey) {
        benar++;
      }
    });
    const skor = Math.round((benar / soalList.length) * 100);

    // Save progress to user registry
    const phone = localStorage.getItem('siswaPhone') || '';
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');

    if (mode === 'pretest') {
      localStorage.setItem('skorPretest', skor.toString());
      localStorage.setItem('pretestDone', 'true');
      localStorage.setItem('pretestTime', elapsed.toString());
      // Update registry
      if (users[phone]) {
        users[phone].pretestDone = true;
        users[phone].skorPretest = skor.toString();
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }
      if (student.phone) {
        student.pretestDone = true;
        student.skorPretest = skor.toString();
        localStorage.setItem('currentStudent', JSON.stringify(student));
      }
      navigate('/siswa/hasil-pretest');
    } else {
      localStorage.setItem('skorPosttest', skor.toString());
      localStorage.setItem('posttestTime', elapsed.toString());
      if (users[phone]) {
        users[phone].skorPosttest = skor.toString();
        users[phone].posttestTime = elapsed.toString();
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }
      navigate('/siswa/hasil-akhir');
    }
  }, [jawaban, mode, navigate, submitted, startTime]);

  // Countdown timer
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) { doSubmit(); return; }
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, doSubmit]);

  // Anti-cheat
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !submitted) {
        setWarningCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            doSubmit();
          } else {
            setShowWarning(true);
          }
          return newCount;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [submitted, doSubmit]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const isWarningTime = timeLeft < 3 * 60;
  const totalSoal = soalList.length;
  const soal = totalSoal > 0 ? soalList[currentQ] : null;
  const label = ['A', 'B', 'C', 'D'];

  // Count stats
  const answeredCount = Object.keys(jawaban).length;
  const flaggedCount = Object.keys(flagged).filter(k => flagged[k]).length;
  const unansweredCount = totalSoal - answeredCount;

  const getQStatus = (i) => {
    if (flagged[i]) return 'flagged';
    if (jawaban[i] !== undefined) return 'answered';
    return 'unanswered';
  };

  const toggleFlag = () => {
    setFlagged(prev => ({ ...prev, [currentQ]: !prev[currentQ] }));
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

        {/* Header */}
        <div className="ujian-header">
          <div className="ujian-header-top">
            <div className="ujian-mode-badge">{mode === 'pretest' ? '📝 Pretest' : '🏆 Posttest'}</div>
            <div className={`ujian-timer ${isWarningTime ? 'warning' : ''}`}>
              <Clock size={14} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="ujian-question-info">Soal {currentQ + 1} dari {totalSoal}</span>
            <button className="ujian-grid-toggle" onClick={() => setShowGrid(true)}>
              <Grid3X3 size={16} />
              <span>Navigasi</span>
            </button>
          </div>
          <div className="ujian-progress-bar">
            <div className="ujian-progress-fill" style={{ width: `${((currentQ + 1) / totalSoal) * 100}%` }}></div>
          </div>
        </div>

        {/* Question Body */}
        <div className="m-body ujian-body">
          {/* Flag indicator */}
          {flagged[currentQ] && (
            <div className="ujian-flag-indicator">
              <Flag size={13} /> Ditandai ragu-ragu
            </div>
          )}

          {soal && (
            <div className="ujian-question-card">
              <p className="ujian-question-text">{soal.pertanyaan}</p>
            </div>
          )}

          <div className="ujian-options">
            {soal && soal.pilihanShuffled.map((pil, i) => (
              <button
                key={i}
                className={`ujian-option ${jawaban[currentQ] === i ? 'selected' : ''}`}
                onClick={() => setJawaban({ ...jawaban, [currentQ]: i })}
              >
                <span className="ujian-option-label">{label[i]}</span>
                <span className="ujian-option-text">{pil.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="ujian-bottom-nav">
          <button
            className="ujian-nav-btn back"
            onClick={() => setCurrentQ(p => Math.max(0, p - 1))}
            disabled={currentQ === 0}
          >
            <ChevronLeft size={18} />
            <span>Kembali</span>
          </button>

          <button
            className={`ujian-nav-btn flag ${flagged[currentQ] ? 'active' : ''}`}
            onClick={toggleFlag}
          >
            <Flag size={16} />
            <span>Ragu</span>
          </button>

          {currentQ < totalSoal - 1 ? (
            <button
              className="ujian-nav-btn next"
              onClick={() => setCurrentQ(p => Math.min(totalSoal - 1, p + 1))}
            >
              <span>Lanjut</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button className="ujian-nav-btn submit" onClick={doSubmit}>
              <Send size={16} />
              <span>Submit</span>
            </button>
          )}
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>

        {/* ═══ Question Grid Overlay ═══ */}
        {showGrid && (
          <div className="m-overlay" onClick={() => setShowGrid(false)}>
            <div className="ujian-grid-panel" onClick={e => e.stopPropagation()}>
              <div className="ujian-grid-header">
                <h3>Navigasi Soal</h3>
                <button className="ujian-grid-close" onClick={() => setShowGrid(false)}><X size={18} /></button>
              </div>

              {/* Legend */}
              <div className="ujian-grid-legend">
                <div className="ujian-legend-item"><span className="ujian-legend-dot answered"></span>Dijawab ({answeredCount})</div>
                <div className="ujian-legend-item"><span className="ujian-legend-dot flagged"></span>Ragu ({flaggedCount})</div>
                <div className="ujian-legend-item"><span className="ujian-legend-dot unanswered"></span>Belum ({unansweredCount})</div>
              </div>

              {/* Grid */}
              <div className="ujian-grid-numbers">
                {soalList.map((_, i) => (
                  <button
                    key={i}
                    className={`ujian-grid-num ${getQStatus(i)} ${currentQ === i ? 'current' : ''}`}
                    onClick={() => { setCurrentQ(i); setShowGrid(false); }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button className="m-btn-primary" style={{ marginTop: 16 }} onClick={doSubmit}>
                <Send size={16} /> Submit Semua Jawaban
              </button>
              <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>
                {answeredCount}/{totalSoal} soal terjawab • {flaggedCount} ragu-ragu
              </p>
            </div>
          </div>
        )}

        {/* Anti-cheat Warning */}
        {showWarning && (
          <div className="m-overlay">
            <div className="m-modal">
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEF2F2', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
                <ShieldAlert size={28} color="#DC2626" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', margin: '0 0 8px 0' }}>⚠️ Peringatan!</h3>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 6px 0', lineHeight: 1.6 }}>
                Sistem mendeteksi Anda <strong>meninggalkan halaman ujian</strong>.
              </p>
              <p style={{ fontSize: 12, color: '#EF4444', fontWeight: 600, margin: '0 0 20px 0' }}>
                Peringatan {warningCount}/2 — Pelanggaran berikutnya akan menyebabkan auto-submit.
              </p>
              <button className="m-btn-primary" onClick={() => setShowWarning(false)} style={{ background: '#DC2626', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}>
                Saya Mengerti, Lanjutkan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UjianPage;
