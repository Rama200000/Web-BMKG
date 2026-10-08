import { useState, useEffect } from 'react';
import {
  Menu, Users,
  BookOpen,
  FileQuestion,
  ClipboardList,
  ChevronDown,
  Download,
  School,
  BarChart2,
  ArrowLeft,
  Home,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Table2,
  Network,
  Image as ImageIcon,
  FileBox,
  X,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../../components/Sidebar';
import './DashboardPage.css';

const API_BASE_URL = 'http://localhost:8000/api';

function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedCakupan, setSelectedCakupan] = useState('Semua');

  
  // Custom Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bar-tooltip">
          <div className="bar-tooltip-label">{label}</div>
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }}></div>
              <span>{entry.name}: <strong>{entry.value}</strong></span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // States from API
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalModul: 0,
    totalDinilai: 0,
    avgSkor: 0,
    sekolahList: [],
    chartData: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Added missing active dropdown state
  const [isSekolahDropdownOpen, setIsSekolahDropdownOpen] = useState(false);
  const [selectedSekolah, setSelectedSekolah] = useState('Semua Sekolah');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard.php`);
        const result = await res.json();
        if (result.success) {
          const formattedChartData = result.data.chartData.map(c => ({
            skor: c.nama_sekolah,
            pretest: parseFloat(c.avg_pretest).toFixed(1),
            posttest: parseFloat(c.avg_posttest).toFixed(1)
          }));

          setStats({
            ...result.data,
            chartData: formattedChartData
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Laporan Rekapitulasi Nilai - Si Iklim Muda', 14, 20);
    
    let filteredData = stats.chartData;
    if (selectedCakupan !== 'Semua') {
      filteredData = stats.chartData.filter(s => s.skor === selectedCakupan);
    }

    const tableData = filteredData.map((s, index) => {
      const sekolah = stats.sekolahList.find(x => x.nama === s.skor);
      return [index + 1, s.skor, sekolah ? sekolah.jumlah_siswa : '-', s.pretest, s.posttest];
    });
    
    autoTable(doc, { 
      startY: 30, 
      head: [['No', 'Nama Sekolah', 'Jumlah Siswa', 'Rata-rata Pre-Test', 'Rata-rata Post-Test']], 
      body: tableData 
    });
    doc.save('Laporan_Dashboard_SiIklimMuda.pdf');
  };

  const handleExportExcel = () => {
    let filteredData = stats.chartData;
    if (selectedCakupan !== 'Semua') {
      filteredData = stats.chartData.filter(s => s.skor === selectedCakupan);
    }

    const tableData = filteredData.map((s, index) => {
      const sekolah = stats.sekolahList.find(x => x.nama === s.skor);
      return { 
        No: index + 1, 
        'Nama Sekolah': s.skor, 
        'Jumlah Siswa': sekolah ? sekolah.jumlah_siswa : '-',
        'Rata-rata Pre-Test': s.pretest,
        'Rata-rata Post-Test': s.posttest
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Rekapitulasi');
    XLSX.writeFile(workbook, 'Laporan_Dashboard_SiIklimMuda.xlsx');
  };

  const handleExportImage = () => {
    setShowExportModal(false);
    setTimeout(() => {
      const svgElement = document.querySelector('.recharts-wrapper svg');
      if (!svgElement) {
        alert("Gagal mengunduh grafik. Silakan coba lagi.");
        return;
      }
      let svgData = new XMLSerializer().serializeToString(svgElement);
      if (!svgData.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgData = svgData.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = svgElement.clientWidth || 800;
        canvas.height = svgElement.clientHeight || 400;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'Grafik_Perbandingan.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }, 300); // Tunggu sampai grafik selesai render ulang
  };

  const handleExportSubmit = () => {
    if (selectedFormat === 'pdf') {
      handleExportPDF();
    } else if (selectedFormat === 'excel') {
      handleExportExcel();
    } else if (selectedFormat === 'image') {
      handleExportImage();
    }
    setShowExportModal(false);
  };

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button className="topbar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              <Menu />
            </button>
            <div className="topbar-breadcrumb">
              <span className="breadcrumb-root">Dashboard</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">Ringkasan</span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-profile">
              <div className="profile-avatar" style={{ background: localStorage.getItem('userRole') === 'superadmin' ? '#7c3aed' : '#2563eb' }}>
                {localStorage.getItem('userRole') === 'superadmin' ? 'SA' : 'A'}
              </div>
              <div className="profile-info">
                <span className="profile-name">{localStorage.getItem('userRole') === 'superadmin' ? 'Super Admin' : 'Admin'}</span>
                <span className="profile-role">{localStorage.getItem('userRole') === 'superadmin' ? 'Root Access' : 'Administrator'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          <h1 className="dashboard-title">Dashboard Analitik</h1>
          <p className="dashboard-subtitle">
            Pantau perkembangan nilai tes awal (pre-test) dan akhir (post-test) siswa.
          </p>

          <>
            {/* Stat Cards */}
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="stat-icon blue"><Users /></div>
                  <div className="stat-info">
                    <span className="stat-label">TOTAL SISWA TERDAFTAR</span>
                    <span className="stat-value">{isLoading ? '-' : stats.totalSiswa}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon teal"><BookOpen /></div>
                  <div className="stat-info">
                    <span className="stat-label">MODUL AKTIF</span>
                    <span className="stat-value">{isLoading ? '-' : stats.totalModul}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon indigo"><FileQuestion /></div>
                  <div className="stat-info">
                    <span className="stat-label">SISWA TELAH DINILAI</span>
                    <span className="stat-value">{isLoading ? '-' : stats.totalDinilai}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon navy"><ClipboardList /></div>
                  <div className="stat-info">
                    <span className="stat-label">RATA-RATA SKOR</span>
                    <span className="stat-value">{isLoading ? '-' : stats.avgSkor}</span>
                  </div>
                </div>
              </div>

              {/* Analysis Card */}
              <div className="analysis-card">
                <div className="analysis-header">
                  <div className="analysis-header-left">
                    <div className="analysis-title-row">
                      <BarChart2 className="analysis-icon" size={20} />
                      <h2 className="analysis-title">Distribusi Nilai Pre-Test vs Post-Test</h2>
                      <div className="analysis-tags">
                        <span className="tag tag-school"><div className="tag-dot"></div> {stats.sekolahList.length} Sekolah</span>
                      </div>
                    </div>
                    <p className="analysis-desc">Grafik perbandingan skor awal (pre-test) sebelum menggunakan modul literasi dengan skor akhir (post-test).</p>
                  </div>
                  <div className="analysis-header-right">
                    <div className="sekolah-dropdown-wrapper">
                      <button 
                        className="sekolah-dropdown-btn"
                        onClick={() => setIsSekolahDropdownOpen(!isSekolahDropdownOpen)}
                      >
                        <School size={16} />
                        {selectedSekolah}
                        <ChevronDown size={14} className={isSekolahDropdownOpen ? 'rotate-180' : ''} />
                      </button>
                      
                      {isSekolahDropdownOpen && (
                        <div className="sekolah-dropdown-menu">
                          <button 
                            className={`sekolah-dropdown-item ${selectedSekolah === 'Semua Sekolah' ? 'active' : ''}`}
                            onClick={() => { setSelectedSekolah('Semua Sekolah'); setIsSekolahDropdownOpen(false); }}
                          >
                            <span>Semua Sekolah</span>
                            <span className="item-count">({stats.sekolahList.length} total)</span>
                          </button>
                          {stats.sekolahList.map((sch, i) => (
                            <button 
                              key={i}
                              className={`sekolah-dropdown-item ${selectedSekolah === sch.nama ? 'active' : ''}`}
                              onClick={() => { setSelectedSekolah(sch.nama); setIsSekolahDropdownOpen(false); }}
                            >
                              <span>{sch.nama}</span>
                              <span className="item-count">({sch.jumlah_siswa} siswa)</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="btn-ekspor" onClick={() => setShowExportModal(true)}>
                      <Download size={15} /> Ekspor Data Laporan
                    </button>
                  </div>
                </div>

                <div className="chart-area">
                  <div className="chart-top-bar">
                    <div className="chart-top-title">Rata-Rata Nilai Berdasarkan Sekolah</div>
                    <div className="chart-legend-row">
                      <div className="chart-legend-item">
                        <div className="legend-box blue-box"></div> Pre-Test
                      </div>
                      <div className="chart-legend-item">
                        <div className="legend-box green-box"></div> Post-Test
                      </div>
                    </div>
                  </div>
                  
                  <div className="chart-wrapper" style={{ width: '100%', height: '350px' }}>
                    {isLoading ? (
                      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        Memuat data analitik...
                      </div>
                    ) : stats.chartData.length === 0 ? (
                      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        Belum ada data nilai tes siswa.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={4} barSize={28}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="skor" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                          <Bar dataKey="pretest" name="Pre-Test" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="posttest" name="Post-Test" fill="#059669" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="chart-axis-labels">
                    <span>*Grafik menampilkan nilai rata-rata tiap sekolah (0-100 poin).</span>
                  </div>
                </div>
              </div>
            </>

          {/* Ekspor Modal */}
          {showExportModal && (
            <div className="hs-modal-overlay" onClick={() => setShowExportModal(false)}>
              <div className="hs-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="hs-modal-header">
                  <div className="hs-modal-title-area">
                    <div className="hs-modal-icon">
                      <FileBox size={18} />
                    </div>
                    <div>
                      <h3 className="hs-modal-title">Ekspor Laporan Nilai & Analisis</h3>
                      <p className="hs-modal-subtitle">Pilih format dokumen dan sesuaikan parameter data yang ingin diekspor ke perangkat Anda.</p>
                    </div>
                  </div>
                  <button className="hs-modal-close" onClick={() => setShowExportModal(false)}>
                    <X size={20} />
                  </button>
                </div>
    
                <div className="hs-modal-body">
                  <div className="hs-form-group">
                    <label className="hs-form-label">1. FORMAT DOKUMEN EKSPOR</label>
                    <div className="hs-format-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                      {/* PDF Option */}
                      <div 
                        className={`hs-format-card ${selectedFormat === 'pdf' ? 'active' : ''}`}
                        onClick={() => setSelectedFormat('pdf')}
                      >
                        <div className="hs-format-card-header">
                          <div className="hs-format-icon-bg red">
                            <FileText size={18} />
                          </div>
                          <div className={`hs-radio-circle ${selectedFormat === 'pdf' ? 'active' : ''}`}>
                            {selectedFormat === 'pdf' && <div className="hs-radio-dot"></div>}
                          </div>
                        </div>
                        <div className="hs-format-card-title">
                          Dokumen PDF <span className="hs-tag red">.pdf</span>
                        </div>
                        <p className="hs-format-card-desc">
                          Siap cetak resmi lengkap dengan kop BMKG, ringkasan grafik, distribusi nilai, dan tabel evaluasi.
                        </p>
                        <div className="hs-format-card-badge blue">
                          <span className="dot"></span> Rekomendasi Cetak
                        </div>
                      </div>
    
                      {/* Excel Option */}
                      <div 
                        className={`hs-format-card ${selectedFormat === 'excel' ? 'active' : ''}`}
                        onClick={() => setSelectedFormat('excel')}
                      >
                        <div className="hs-format-card-header">
                          <div className="hs-format-icon-bg green">
                            <FileSpreadsheet size={18} />
                          </div>
                          <div className={`hs-radio-circle ${selectedFormat === 'excel' ? 'active' : ''}`}>
                            {selectedFormat === 'excel' && <div className="hs-radio-dot"></div>}
                          </div>
                        </div>
                        <div className="hs-format-card-title">
                          Spreadsheet <span className="hs-tag green">.xlsx</span>
                        </div>
                        <p className="hs-format-card-desc">
                          Data mentah terstruktur lengkap dengan formula nilai, dan kalkulasi statistik.
                        </p>
                        <div className="hs-format-card-badge gray">
                          Analisis Lanjutan
                        </div>
                      </div>
                      
                      {/* Image Option */}
                      <div 
                        className={`hs-format-card ${selectedFormat === 'image' ? 'active' : ''}`}
                        onClick={() => setSelectedFormat('image')}
                      >
                        <div className="hs-format-card-header">
                          <div className="hs-format-icon-bg purple" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                            <ImageIcon size={18} />
                          </div>
                          <div className={`hs-radio-circle ${selectedFormat === 'image' ? 'active' : ''}`}>
                            {selectedFormat === 'image' && <div className="hs-radio-dot"></div>}
                          </div>
                        </div>
                        <div className="hs-format-card-title">
                          Gambar Grafik <span className="hs-tag purple" style={{ background: '#f3e8ff', color: '#9333ea' }}>.png</span>
                        </div>
                        <p className="hs-format-card-desc">
                          Unduh grafik perbandingan nilai pre-test dan post-test dalam format gambar (PNG).
                        </p>
                        <div className="hs-format-card-badge gray" style={{ background: '#faf5ff', color: '#9333ea', border: '1px solid #e9d5ff' }}>
                          Visualisasi
                        </div>
                      </div>
                    </div>
                  </div>
    
                  <div className="hs-form-group" style={{ marginTop: '24px' }}>
                    <label className="hs-form-label">2. CAKUPAN DATA SISWA</label>
                    <div className="hs-select-full">
                      <select value={selectedCakupan} onChange={(e) => setSelectedCakupan(e.target.value)}>
                        <option value="Semua">Semua Siswa Terdaftar ({stats.totalSiswa} Siswa / Seluruh Sekolah)</option>
                        {stats.sekolahList.map((sek, idx) => (
                           <option key={idx} value={sek.nama}>{sek.nama} ({sek.jumlah_siswa} Siswa)</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="select-icon" />
                    </div>
                  </div>
                </div>
    
                <div className="hs-modal-footer">
                  <span className="hs-footer-note">Atau ekspor langsung sebagai .xlsx</span>
                  <div className="hs-modal-actions">
                    <button className="btn-modal-cancel" onClick={() => setShowExportModal(false)}>Batal</button>
                    <button className="btn-modal-submit" onClick={handleExportSubmit}>
                      <Download size={14} /> Unduh Laporan ({selectedFormat === 'pdf' ? '.PDF' : selectedFormat === 'excel' ? '.XLSX' : '.PNG'})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
