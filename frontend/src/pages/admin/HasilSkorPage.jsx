import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronRight,
  ChevronDown,
  Download,
  Eye,
  Search,
  FileText,
  Star,
  TrendingUp,
  Users,
  ChevronLeft,
  X,
  FileBox
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Sidebar from '../../components/Sidebar';
import './HasilSkorPage.css';

const API_BASE_URL = 'http://localhost:8000/api';

function HasilSkorPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [hasilSkorData, setHasilSkorData] = useState([]);
  const [stats, setStats] = useState({ avgPreTest: 0, avgPostTest: 0, nGain: 0, totalPeserta: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkor = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/skor.php`);
        const result = await res.json();
        if (result.success) {
          const formattedData = result.data.map((item, index) => ({
            no: index + 1,
            nama: item.siswa,
            hp: item.hp,
            sekolah: item.sekolah,
            kelas: item.kelas,
            preTest: parseFloat(item.pre_test_score) || 0,
            postTest: parseFloat(item.post_test_score) || 0,
            peningkatan: (parseFloat(item.post_test_score) || 0) - (parseFloat(item.pre_test_score) || 0)
          }));
          
          setHasilSkorData(formattedData);

          // Hitung statistik
          const avgPre = formattedData.length ? formattedData.reduce((s, d) => s + d.preTest, 0) / formattedData.length : 0;
          const avgPost = formattedData.length ? formattedData.reduce((s, d) => s + d.postTest, 0) / formattedData.length : 0;
          
          let nGainTotal = 0;
          let nGainCount = 0;
          formattedData.forEach(d => {
            if (d.preTest < 100) {
              const gain = (d.postTest - d.preTest) / (100 - d.preTest);
              nGainTotal += gain;
              nGainCount++;
            }
          });
          const avgNGain = nGainCount ? (nGainTotal / nGainCount) : 0;

          setStats({
            avgPreTest: avgPre.toFixed(1),
            avgPostTest: avgPost.toFixed(1),
            nGain: avgNGain.toFixed(2),
            totalPeserta: formattedData.length
          });
        }
      } catch (error) {
        console.error('Error fetching skor:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkor();
  }, []);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header text
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('Laporan Hasil Skor (Pre-Test & Post-Test)', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('Evaluasi komparasi peningkatan pemahaman modul literasi iklim siswa.', 14, 30);
    
    const tableColumn = ["NO", "NAMA SISWA", "SEKOLAH", "KELAS", "PRE-TEST", "POST-TEST", "PENINGKATAN"];
    const tableRows = [];

    hasilSkorData.forEach(item => {
      const peningkatStr = item.peningkatan > 0 ? `+${item.peningkatan}` : item.peningkatan.toString();
      const rowData = [
        item.no,
        item.nama,
        item.sekolah,
        item.kelas,
        item.preTest.toString(),
        item.postTest.toString(),
        peningkatStr
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 10 }
    });

    doc.save('Laporan_Hasil_Skor.pdf');
  };

  const handleExportExcel = () => {
    const worksheetData = hasilSkorData.map(item => ({
      'No': item.no,
      'Nama Siswa': item.nama,
      'No HP': item.hp,
      'Asal Sekolah': item.sekolah,
      'Kelas': item.kelas,
      'Nilai Pre-Test': item.preTest,
      'Nilai Post-Test': item.postTest,
      'Peningkatan': item.peningkatan > 0 ? `+${item.peningkatan}` : item.peningkatan
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Skor Siswa");
    
    XLSX.writeFile(workbook, "Laporan_Hasil_Skor.xlsx");
  };

  const handleExportSubmit = () => {
    if (selectedFormat === 'excel') {
      handleExportExcel();
    } else {
      handleExportPDF();
    }
    setShowExportModal(false);
  };

  return (
    <div className={`hasil-skor-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="hasil-skor-main">
        {/* Top Bar */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="topbar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu />
            </button>
            <div className="topbar-breadcrumb">
              <span className="breadcrumb-root">Dashboard</span>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <span className="breadcrumb-root">Hasil Skor</span>
              <ChevronRight size={13} className="breadcrumb-sep" />
              <span className="breadcrumb-current">Pre-Test vs Post-Test</span>
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
        <div className="hasil-skor-content">
          
          {/* Header */}
          <div className="hs-header-wrapper">
            <div className="hs-header-left">
              <h1 className="hs-title">Hasil Skor Pre-Test & Post-Test</h1>
              <p className="hs-subtitle">Evaluasi komparasi peningkatan pemahaman modul literasi iklim siswa.</p>
            </div>
            <div className="hs-header-actions">
              <Link to="/hasil-skor/leaderboard" className="btn-leaderboard">
                Tampilkan LeaderBoard
              </Link>
              <button className="btn-ekspor" onClick={() => setShowExportModal(true)}>
                <Download size={16} />
                Ekspor Laporan
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="hs-stat-cards">
            <div className="hs-stat-card">
              <div className="hs-stat-info">
                <span className="hs-stat-label">RATA-RATA PRE-TEST</span>
                <span className="hs-stat-value">{isLoading ? '-' : stats.avgPreTest}</span>
              </div>
              <div className="hs-stat-icon-wrap gray"><FileText size={20} /></div>
            </div>
            <div className="hs-stat-card">
              <div className="hs-stat-info">
                <span className="hs-stat-label">RATA-RATA POST-TEST</span>
                <span className="hs-stat-value">{isLoading ? '-' : stats.avgPostTest}</span>
              </div>
              <div className="hs-stat-icon-wrap blue"><Star size={20} /></div>
            </div>
            <div className="hs-stat-card">
              <div className="hs-stat-info">
                <span className="hs-stat-label">RATA-RATA N-GAIN</span>
                <span className="hs-stat-value">{isLoading ? '-' : stats.nGain} <span className="stat-unit">%</span></span>
              </div>
              <div className="hs-stat-icon-wrap green"><TrendingUp size={20} /></div>
            </div>
            <div className="hs-stat-card">
              <div className="hs-stat-info">
                <span className="hs-stat-label">TOTAL PESERTA DINILAI</span>
                <span className="hs-stat-value">{isLoading ? '-' : stats.totalPeserta}</span>
              </div>
              <div className="hs-stat-icon-wrap pink"><Users size={20} /></div>
            </div>
          </div>

          {/* Table Container */}
          <div className="hs-container">
            
            {/* Filter Bar */}
            <div className="hs-filter-bar">
              <div className="hs-filters-left">
                <div className="hs-select-wrap">
                  <select>
                    <option>Pre-Test & Post-Test</option>
                  </select>
                  <ChevronDown size={14} className="select-icon" />
                </div>
                <div className="hs-select-wrap">
                  <select>
                    <option>Semua Sekolah</option>
                  </select>
                  <ChevronDown size={14} className="select-icon" />
                </div>
                <div className="hs-select-wrap">
                  <select>
                    <option>Semua Kelas</option>
                  </select>
                  <ChevronDown size={14} className="select-icon" />
                </div>
              </div>
              
              <div className="hs-search">
                <Search size={15} />
                <input type="text" placeholder="Cari nama siswa..." />
              </div>
            </div>

            {/* Table */}
            <div className="hs-table-wrapper">
              <table className="hs-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>NO</th>
                    <th>NAMA SISWA</th>
                    <th>SEKOLAH</th>
                    <th>KELAS</th>
                    <th style={{ textAlign: 'center' }}>PRE-TEST</th>
                    <th style={{ textAlign: 'center' }}>POST-TEST</th>
                    <th style={{ textAlign: 'center' }}>PENINGKATAN</th>
                    <th style={{ textAlign: 'center', width: '120px' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Memuat data skor...</td>
                    </tr>
                  ) : hasilSkorData.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Belum ada data skor yang terkumpul.</td>
                    </tr>
                  ) : hasilSkorData.map((item) => (
                    <tr key={item.no}>
                      <td className="td-no">{item.no}</td>
                      <td>
                        <div className="cell-nama-siswa">
                          <span className="nama-siswa-text">{item.nama}</span>
                          {item.hp !== '-' && <span className="nama-siswa-sub">No Hp: {item.hp}</span>}
                        </div>
                      </td>
                      <td>
                        <span className="cell-sekolah">{item.sekolah}</span>
                      </td>
                      <td>
                        <span className="badge-kelas">{item.kelas}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="cell-score">{item.preTest}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="cell-score text-green">{item.postTest}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <span className={`badge-peningkatan ${item.peningkatan >= 0 ? 'green' : 'red'}`}>
                            {item.peningkatan > 0 ? `+${item.peningkatan}` : item.peningkatan}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Link to="/hasil-skor/detail" className="btn-detail-row">
                            <Eye size={14} />
                            Detail
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="ds-table-footer">
              <span className="ds-table-info">Menampilkan 1 - 7 dari 120 data siswa</span>
              <div className="ds-pagination">
                <button className="page-btn"><ChevronLeft size={14} /></button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span className="page-dots">...</span>
                <button className="page-btn">20</button>
                <button className="page-btn"><ChevronRight size={14} /></button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Export Modal */}
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
                <div className="hs-format-options">
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
                      <span className="dot"></span> Rekomendasi Cetak / Arsip
                    </div>
                  </div>

                  {/* Excel Option */}
                  <div 
                    className={`hs-format-card ${selectedFormat === 'excel' ? 'active' : ''}`}
                    onClick={() => setSelectedFormat('excel')}
                  >
                    <div className="hs-format-card-header">
                      <div className="hs-format-icon-bg green">
                        <FileText size={18} />
                      </div>
                      <div className={`hs-radio-circle ${selectedFormat === 'excel' ? 'active' : ''}`}>
                        {selectedFormat === 'excel' && <div className="hs-radio-dot"></div>}
                      </div>
                    </div>
                    <div className="hs-format-card-title">
                      Spreadsheet Excel <span className="hs-tag green">.xlsx</span>
                    </div>
                    <p className="hs-format-card-desc">
                      Data mentah terstruktur lengkap dengan formula nilai, delta peningkatan, dan kalkulasi N-Gain.
                    </p>
                    <div className="hs-format-card-badge gray">
                      Analisis Lanjutan
                    </div>
                  </div>
                </div>
              </div>

              <div className="hs-form-group" style={{ marginTop: '24px' }}>
                <label className="hs-form-label">2. CAKUPAN DATA SISWA</label>
                <div className="hs-select-full">
                  <select>
                    <option>Semua Siswa Terdaftar (120 Siswa / Seluruh Sekolah)</option>
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
                  <Download size={14} /> Unduh Laporan ({selectedFormat === 'pdf' ? '.PDF' : '.XLSX'})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HasilSkorPage;
