import { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Users,
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
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Sidebar from '../../components/Sidebar';
import './DashboardPage.css';

const API_BASE_URL = 'http://localhost:8000/api';

function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isExportMode, setIsExportMode] = useState(false);
  
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
    doc.text('Laporan Rekapitulasi Data - Si Iklim Muda', 14, 20);
    const tableData = stats.sekolahList.map((s, index) => [index + 1, s.nama, s.jumlah_siswa]);
    doc.autoTable({ startY: 30, head: [['No', 'Nama Sekolah', 'Jumlah Siswa Terdaftar']], body: tableData });
    doc.save('Laporan_Dashboard_SiIklimMuda.pdf');
  };

  const handleExportExcel = () => {
    const tableData = stats.sekolahList.map((s, index) => ({ No: index + 1, 'Nama Sekolah': s.nama, 'Jumlah Siswa': s.jumlah_siswa }));
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Sekolah');
    XLSX.writeFile(workbook, 'Laporan_Dashboard_SiIklimMuda.xlsx');
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
              <span className="breadcrumb-current">{isExportMode ? 'Ekspor Laporan' : 'Ringkasan'}</span>
            </div>
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
        <div className="dashboard-content">
          <h1 className="dashboard-title">{isExportMode ? 'Ekspor Laporan Analitik' : 'Dashboard Analitik'}</h1>
          <p className="dashboard-subtitle">
            {isExportMode 
              ? 'Pilih format laporan yang ingin Anda unduh dari sistem.' 
              : 'Pantau perkembangan nilai tes awal (pre-test) dan akhir (post-test) siswa.'}
          </p>

          {!isExportMode ? (
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
                    <button className="btn-ekspor" onClick={() => setIsExportMode(true)}>
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
          ) : (
            /* Export Mode View */
            <div className="ekspor-view">
              <div className="ekspor-subbread">
                <div className="ekspor-bread-left">
                  <button className="btn-kembali-grafik" onClick={() => setIsExportMode(false)}>
                    <ArrowLeft size={16} /> Kembali
                  </button>
                  <ChevronRight size={13} />
                  <span className="bread-active">Pilih Format Ekspor</span>
                </div>
              </div>

              <div className="ekspor-grid">
                <div className="ekspor-card">
                  <div className="ekspor-card-header">
                    <div className="ekspor-icon-box excel"><FileSpreadsheet size={24} /></div>
                    <div className="ekspor-badge excel-badge">Tabel Olah Data</div>
                  </div>
                  <div className="ekspor-card-body">
                    <h3>Ekspor ke Microsoft Excel (.xlsx)</h3>
                    <p>Format spreadsheet mentah yang berisi data nilai siswa. Sangat cocok jika Anda ingin mengolah, memfilter, atau mengurutkan data lebih lanjut menggunakan rumus Excel.</p>
                  </div>
                  <div className="ekspor-card-footer">
                    <button className="btn-download excel" onClick={handleExportExcel}>
                      <Download size={15} /> Unduh File Excel
                    </button>
                  </div>
                </div>

                <div className="ekspor-card">
                  <div className="ekspor-card-header">
                    <div className="ekspor-icon-box pdf"><FileText size={24} /></div>
                    <div className="ekspor-badge pdf-badge">Dokumen Siap Cetak</div>
                  </div>
                  <div className="ekspor-card-body">
                    <h3>Ekspor ke Dokumen PDF (.pdf)</h3>
                    <p>Laporan rekapan yang sudah ditata rapi secara otomatis. Sangat ideal untuk keperluan cetak, lampiran dokumen resmi, atau dibagikan kepada pihak lain (kepala sekolah/guru).</p>
                  </div>
                  <div className="ekspor-card-footer">
                    <button className="btn-download pdf" onClick={handleExportPDF}>
                      <Download size={15} /> Unduh File PDF
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
