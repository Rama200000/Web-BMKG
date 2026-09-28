import { ChevronLeft, GraduationCap, Battery, Wifi, Signal, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DataPenggunaPage.css'; // Reusing mobile layout CSS

function ScanBarcodePage() {
  const navigate = useNavigate();

  return (
    <div className="mobile-app-container">
      <div className="mobile-screen">
        <div className="status-bar">
          <span className="time">09.41</span>
          <div className="status-icons">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={16} />
          </div>
        </div>

        <header className="mobile-header">
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

        <div className="form-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
          <h1 className="page-title" style={{ textAlign: 'center', marginBottom: 40 }}>Scan Barcode</h1>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ 
              width: 250, height: 250, border: '2px dashed #94a3b8', borderRadius: 24, 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#f8fafc', marginBottom: 24, position: 'relative'
            }}>
              {/* Scan corners */}
              <div style={{ position: 'absolute', top: 20, left: 20, width: 30, height: 30, borderTop: '4px solid #0f172a', borderLeft: '4px solid #0f172a', borderRadius: '8px 0 0 0' }}></div>
              <div style={{ position: 'absolute', top: 20, right: 20, width: 30, height: 30, borderTop: '4px solid #0f172a', borderRight: '4px solid #0f172a', borderRadius: '0 8px 0 0' }}></div>
              <div style={{ position: 'absolute', bottom: 20, left: 20, width: 30, height: 30, borderBottom: '4px solid #0f172a', borderLeft: '4px solid #0f172a', borderRadius: '0 0 0 8px' }}></div>
              <div style={{ position: 'absolute', bottom: 20, right: 20, width: 30, height: 30, borderBottom: '4px solid #0f172a', borderRight: '4px solid #0f172a', borderRadius: '0 0 8px 0' }}></div>
              
              <div style={{ width: '80%', height: 2, backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981', animation: 'scan 2s infinite' }}></div>
              
              <ScanLine size={32} color="#64748b" style={{ position: 'absolute' }} />
              <style>
                {`
                  @keyframes scan {
                    0% { transform: translateY(-80px); }
                    50% { transform: translateY(80px); }
                    100% { transform: translateY(-80px); }
                  }
                `}
              </style>
            </div>
            
            <p style={{ color: '#64748b', fontSize: 13, textAlign: 'center' }}>ARAHKAN KE BARCODE</p>
          </div>

          <div className="submit-section" style={{ marginTop: 'auto' }}>
            <button className="submit-btn" onClick={() => navigate('/siswa/data-pengguna')} style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <ScanLine size={18} />
              Scan Barcode
            </button>
            <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 12 }}>
              Pastikan barcode terlihat jelas dan masuk ke dalam bingkai.
            </p>
          </div>
        </div>

        <div className="home-indicator"><div className="indicator-line"></div></div>
      </div>
    </div>
  );
}

export default ScanBarcodePage;
