import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ScanBarcode, Scan, Zap, ZapOff, Info, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import './mobile-green-theme.css';
import './siswa-navy.css';
import './ScanBarcodePage.css';

// QR dari halaman admin berisi URL `${origin}/siswa/scan?src=qr`.
// Origin & query tidak dicek agar QR yang dicetak dari localhost / domain produksi tetap valid.
const isValidCode = (text) => {
  try {
    return new URL(text).pathname.replace(/\/+$/, '') === '/siswa/scan';
  } catch {
    return false;
  }
};

// Pindai seluruh frame kamera (default qr-scanner hanya 2/3 bagian tengah),
// diperkecil maksimal 720px agar tetap ringan di HP
const scanWholeFrame = (video) => {
  const { videoWidth: w, videoHeight: h } = video;
  const scale = Math.min(1, 720 / Math.max(w, h));
  return {
    x: 0,
    y: 0,
    width: w,
    height: h,
    downScaledWidth: Math.round(w * scale),
    downScaledHeight: Math.round(h * scale),
  };
};

const cameraErrorMessage = (err) => {
  const name = err?.name || '';
  const msg = String(err?.message || err || '').toLowerCase();
  if (name === 'NotAllowedError' || name === 'SecurityError' || msg.includes('permission')) {
    return 'Izin kamera ditolak. Aktifkan izin kamera untuk situs ini di pengaturan browser, lalu coba lagi.';
  }
  if (name === 'NotFoundError' || msg.includes('not found')) {
    return 'Kamera tidak ditemukan di perangkat ini.';
  }
  if (name === 'NotReadableError') {
    return 'Kamera sedang dipakai aplikasi lain. Tutup aplikasi tersebut, lalu coba lagi.';
  }
  return 'Kamera tidak dapat dibuka. Silakan coba lagi.';
};

function ScanBarcodePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const doneRef = useRef(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'starting' | 'scanning' | 'success'
  const [error, setError] = useState(null);
  const [invalid, setInvalid] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  // Dibuka dari kartu Posttest di Dashboard → setelah scan, verifikasi ulang nomor lalu ke info posttest
  const untukPosttest = searchParams.get('untuk') === 'posttest';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // Matikan kamera saat keluar dari halaman
  useEffect(() => () => {
    scannerRef.current?.destroy();
    scannerRef.current = null;
  }, []);

  const handleDecode = (result) => {
    if (doneRef.current) return;
    if (isValidCode(result.data)) {
      doneRef.current = true;
      scannerRef.current?.stop();
      setInvalid(false);
      setFlashOn(false);
      setStatus('success');
      setTimeout(() => navigate(untukPosttest ? '/siswa/verifikasi-id?untuk=posttest' : '/siswa/verifikasi-id'), 800);
    } else {
      setInvalid(true);
    }
  };

  const startScan = async () => {
    setError(null);
    setInvalid(false);

    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError('Kamera hanya bisa diakses lewat koneksi aman (HTTPS). Buka halaman ini melalui alamat https://');
      return;
    }

    setStatus('starting');
    try {
      if (!scannerRef.current) {
        scannerRef.current = new QrScanner(videoRef.current, handleDecode, {
          preferredCamera: 'environment',
          returnDetailedScanResult: true,
          maxScansPerSecond: 10,
          calculateScanRegion: scanWholeFrame,
        });
      }
      await scannerRef.current.start();
      setStatus('scanning');
      setFlashSupported(await scannerRef.current.hasFlash());
    } catch (err) {
      scannerRef.current?.stop();
      setStatus('idle');
      setError(cameraErrorMessage(err));
    }
  };

  const stopScan = () => {
    scannerRef.current?.stop();
    setStatus('idle');
    setInvalid(false);
    setFlashOn(false);
    setFlashSupported(false);
  };

  const toggleFlash = async () => {
    const scanner = scannerRef.current;
    if (!scanner || !flashSupported) return;
    try {
      await scanner.toggleFlash();
      setFlashOn(scanner.isFlashOn());
    } catch {
      setFlashSupported(false);
    }
  };

  const cameraActive = status === 'scanning';
  const busy = status === 'starting' || status === 'success';

  // Dibuka dari QR lewat kamera HP / Google Lens → QR sudah terpindai, tidak perlu scan lagi
  if (searchParams.get('src') === 'qr') {
    return <Navigate to="/siswa/verifikasi-id" replace />;
  }

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
          {untukPosttest && (
            <button type="button" className="nv-back-btn" onClick={() => navigate('/siswa/dashboard')} aria-label="Kembali ke Dashboard">
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="m-app-title">Si Iklim Muda</div>
          <div className="nv-badge"><div className="nv-badge-dot"></div> Siswa</div>
        </header>

        {/* Body */}
        <div className="m-body nv-body">
          <h1 className="nv-title">Scan Barcode</h1>

          {/* Viewfinder Card */}
          <div className={`scan-card${cameraActive ? ' live' : ''}`}>
            <video ref={videoRef} className="scan-video" playsInline muted />

            <button
              type="button"
              className={`scan-flash-btn${flashOn ? ' active' : ''}`}
              onClick={toggleFlash}
              disabled={!cameraActive || !flashSupported}
              aria-label={flashOn ? 'Matikan senter' : 'Nyalakan senter'}
              aria-pressed={flashOn}
              title={cameraActive && !flashSupported ? 'Senter tidak didukung perangkat ini' : undefined}
            >
              {cameraActive && !flashSupported ? <ZapOff size={14} /> : <Zap size={14} />}
            </button>

            <div className="scan-frame">
              <div className="scan-corner tl"></div>
              <div className="scan-corner tr"></div>
              <div className="scan-corner bl"></div>
              <div className="scan-corner br"></div>

              {!cameraActive && (
                <div className="scan-center">
                  <div className="scan-center-icon"><Scan size={24} strokeWidth={1.75} /></div>
                  <span className="scan-hint">Arahkan ke barcode</span>
                </div>
              )}

              <div className={`scan-line${cameraActive ? ' moving' : ''}`}></div>
            </div>
          </div>

          {/* Status */}
          {error && (
            <div className="nv-alert fail">
              <AlertTriangle size={18} />
              <div>
                <strong>Kamera Tidak Tersedia</strong>
                <p>{error}</p>
              </div>
            </div>
          )}
          {invalid && cameraActive && (
            <div className="nv-alert fail">
              <AlertTriangle size={18} />
              <div>
                <strong>Barcode Tidak Valid</strong>
                <p>Barcode ini bukan milik Si Iklim Muda. Arahkan ke barcode dari guru.</p>
              </div>
            </div>
          )}
          {status === 'success' && (
            <div className="nv-alert success">
              <CheckCircle2 size={18} />
              <div>
                <strong>Scan Berhasil!</strong>
                <p>Mengarahkan ke halaman verifikasi...</p>
              </div>
            </div>
          )}

          {/* Scan Button */}
          <div className="nv-footer">
            <button
              className={`nv-btn${cameraActive ? ' secondary' : ''}${busy ? ' loading' : ''}`}
              onClick={cameraActive ? stopScan : startScan}
              disabled={busy}
            >
              {busy ? (
                <>
                  <div className="nv-spinner"></div>
                  {status === 'starting' ? 'Membuka kamera...' : 'Mengarahkan...'}
                </>
              ) : cameraActive ? (
                <>
                  <X size={18} />
                  Batalkan
                </>
              ) : (
                <>
                  <ScanBarcode size={18} />
                  Scan Barcode
                </>
              )}
            </button>
            <p className="nv-note">
              <Info size={14} className="nv-note-icon" />
              <span>Pastikan barcode terlihat jelas dan masuk ke dalam bingkai.</span>
            </p>
          </div>
        </div>

        <div className="m-home-indicator"><div className="m-home-indicator-line"></div></div>
      </div>
    </div>
  );
}

export default ScanBarcodePage;
