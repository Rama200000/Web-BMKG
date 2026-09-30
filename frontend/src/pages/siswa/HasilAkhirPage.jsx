import { useEffect, useState } from 'react';
import { Trophy, ArrowRight, ArrowUpRight, ArrowDownRight, Minus, Crown, Medal, Award, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './mobile-green-theme.css';
import './HasilAkhirPage.css';

function HasilAkhirPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  
  const skorPretest = parseInt(localStorage.getItem('skorPretest') || '0');
  const skorPosttest = parseInt(localStorage.getItem('skorPosttest') || '0');
  const posttestTimeSecs = parseInt(localStorage.getItem('posttestTime') || '0');
  const student = JSON.parse(localStorage.getItem('currentStudent') || '{}');

  const selisih = skorPosttest - skorPretest;
  const isImproved = selisih > 0;
  const isDeclined = selisih < 0;

  // Format time (MM:SS)
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mock Leaderboard Data (enriched)
  const leaderboardData = [
    { rank: 1, nama: 'Aulia Rahma', pre: 70, post: 98, timeSecs: 504 }, // 08:24
    { rank: 2, nama: 'Budi Santoso', pre: 65, post: 95, timeSecs: 555 }, // 09:15
    { rank: 3, nama: 'Citra Dewi', pre: 75, post: 92, timeSecs: 603 }, // 10:03
    { rank: 4, nama: student.nama || 'Kamu', pre: skorPretest, post: skorPosttest, timeSecs: posttestTimeSecs }, // Current user
    { rank: 5, nama: 'Eka Putri', pre: 60, post: 85, timeSecs: 587 }, // 09:47
  ];
  
  // Sort leaderboard by posttest score (desc), then time (asc)
  const sortedLeaderboard = [...leaderboardData].sort((a, b) => {
    if (b.post !== a.post) return b.post - a.post;
    return a.timeSecs - b.timeSecs;
  }).map((item, index) => ({ ...item, rank: index + 1 }));

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  const getScoreColor = (s) => {
    if (s >= 80) return '#059669';
    if (s >= 60) return '#D97706';
    return '#DC2626';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={18} color="#F59E0B" />;
    if (rank === 2) return <Medal size={18} color="#9CA3AF" />;
    if (rank === 3) return <Award size={18} color="#B45309" />;
    return <span style={{ fontSize: 14, fontWeight: 700, color: '#6B7280' }}>{rank}</span>;
  };

  const handleSelesai = () => {
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

        {/* Gradient Header */}
        <div className="akhir-header">
          <div className="akhir-trophy-icon">🏆</div>
          <h2 className="akhir-header-title">Hasil Akhir Pembelajaran</h2>
          <p className="akhir-header-sub">Selamat, {student.nama || 'Siswa'}!</p>
        </div>

        <div className="m-body akhir-body">
          {/* Comparison Dashboard */}
          <div className="akhir-dashboard-card">
            <div className="akhir-score-split">
              <div className="akhir-score-col">
                <span className="akhir-score-lbl">Pretest</span>
                <span className="akhir-score-val" style={{ color: getScoreColor(skorPretest) }}>{skorPretest}</span>
              </div>
              
              <div className="akhir-score-divider">
                <ArrowRight size={20} color="#9CA3AF" />
              </div>
              
              <div className="akhir-score-col">
                <span className="akhir-score-lbl">Posttest</span>
                <span className="akhir-score-val" style={{ color: getScoreColor(skorPosttest), fontSize: 32 }}>{skorPosttest}</span>
              </div>
            </div>

            <div className="akhir-stats-row">
              <div className="akhir-stat-item">
                <span className="akhir-stat-lbl">Progres Nilai</span>
                <div className={`akhir-improvement ${isImproved ? 'up' : isDeclined ? 'down' : 'neutral'}`}>
                  {isImproved && <ArrowUpRight size={16} />}
                  {isDeclined && <ArrowDownRight size={16} />}
                  {!isImproved && !isDeclined && <Minus size={16} />}
                  <span>{isImproved ? '+' : ''}{selisih} Poin</span>
                </div>
              </div>
              <div className="akhir-stat-item">
                <span className="akhir-stat-lbl">Waktu Posttest</span>
                <div className="akhir-time-badge">
                  <Clock size={14} />
                  <span>{formatTime(posttestTimeSecs)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Top 5 */}
          <div className="akhir-leaderboard">
            <div className="akhir-lb-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trophy size={18} color="#F59E0B" />
                <h3>Leaderboard Top 5</h3>
              </div>
              <span style={{ fontSize: 11, color: '#6B7280' }}>Berdasarkan Skor & Waktu</span>
            </div>

            <div className="akhir-lb-list">
              {sortedLeaderboard.map((item) => {
                const itemSelisih = item.post - item.pre;
                const isMe = item.nama === (student.nama || 'Kamu');
                return (
                  <div key={item.rank} className={`akhir-lb-item ${item.rank <= 3 ? 'top' : ''} ${isMe ? 'is-me' : ''}`}>
                    <div className="akhir-lb-rank">
                      {getRankIcon(item.rank)}
                    </div>
                    
                    <div className="akhir-lb-info">
                      <div className="akhir-lb-name-row">
                        <span className="akhir-lb-name">{item.nama} {isMe && '(Kamu)'}</span>
                        <div className="akhir-lb-time-mini">
                          <Clock size={10} /> {formatTime(item.timeSecs)}
                        </div>
                      </div>
                      
                      <div className="akhir-lb-scores">
                        <span className="lb-score-mini pre">Pre: {item.pre}</span>
                        <ArrowRight size={10} color="#9CA3AF" />
                        <span className="lb-score-mini post">Post: {item.post}</span>
                        <span className={`lb-score-diff ${itemSelisih > 0 ? 'up' : itemSelisih < 0 ? 'down' : ''}`}>
                          {itemSelisih > 0 ? `+${itemSelisih}` : itemSelisih}
                        </span>
                      </div>
                    </div>
                    
                    <div className="akhir-lb-score-final">{item.post}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Finish Button */}
          <div style={{ marginTop: 24, paddingBottom: 20 }}>
            <button className="m-btn-primary" onClick={handleSelesai}>
              <CheckCircle2 size={18} />
              Selesai Belajar
            </button>
          </div>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default HasilAkhirPage;
