# 🌦️ Si Iklim Muda BMKG

Aplikasi Pembelajaran dan Ujian Interaktif Literasi Iklim untuk Siswa Sekolah, dikembangkan atas kerja sama **BMKG Stasiun Klimatologi Lampung** dan **PKL TRPL Politeknik Negeri Lampung (Polinela) 2026**.

---

## 📋 Daftar Kebutuhan Sistem (System Requirements)

Sebelum menjalankan aplikasi, pastikan perangkat lokal Anda telah memenuhi spesifikasi berikut:

### 1. Runtime & Bahasa Pemrograman
- **PHP**: Versi `>= 8.1` (Direkomendasikan PHP 8.2 atau 8.4 via Laragon/XAMPP).
  - Ekstensi PHP yang aktif: `pdo_mysql`, `curl`, `json`, `fileinfo`, `mbstring`, `openssl`.
- **Node.js**: Versi `>= 18.0.0` (Direkomendasikan Node.js v20.x atau v22.x).
- **npm**: Versi `>= 9.x` atau bawaan Node.js.

### 2. Database Server
- **MySQL / MariaDB**: MySQL `>= 8.0` atau MariaDB `>= 10.4` (aktif di port default `3306`).
- Nama Database default: `bmkg_si_iklim_muda`
- User database default: `root` (tanpa password).

### 3. Port Jaringan Lokal
- Port `5173`: Frontend React + Vite
- Port `8000`: Backend API PHP
- Port `3306`: MySQL Database Server

---

## 🔐 Akun & Kredensial Default

### Admin / Super Admin (Portal Admin)
- **Halaman Login**: [http://localhost:5173/login](http://localhost:5173/login)
- **NIP**: `198503152010`
- **Email**: `admin@bmkg.go.id`
- **Kata Sandi**: `admin123`
- **Role**: `superadmin`

### Siswa (Portal Siswa / Publik)
- **Halaman Masuk Siswa**: [http://localhost:5173/siswa/scan](http://localhost:5173/siswa/scan)
- Siswa masuk menggunakan fitur **Scan Barcode / QR Code** atau memasukkan nomor HP / ID yang terdaftar saat verifikasi biodata.

---

## 🚀 Cara Menjalankan Project

### Cara Cepat (Sekali Klik)
Tersedia script launcher otomatis untuk Windows di root folder:
- **Mode Normal (HTTP)**: Dobel klik [`start-dev.bat`](file:///d:/BMKG%202026/SIKLIM/start-dev.bat)
- **Mode HTTPS (Untuk Akses Kamera HP / Scan Barcode)**: Dobel klik [`start-dev-https.bat`](file:///d:/BMKG%202026/SIKLIM/start-dev-https.bat)

---

### Cara Manual lewat Terminal

#### 1. Persiapan Database (Jika Belum Ada)
Pastikan MySQL sudah berjalan (misal: jalankan Laragon / XAMPP), lalu import skema:
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS bmkg_si_iklim_muda;"
mysql -u root bmkg_si_iklim_muda < backend/database.sql
```

#### 2. Jalankan Backend PHP
Buka terminal dan arahkan ke folder `backend`:
```powershell
cd "d:\BMKG 2026\SIKLIM\backend"
php -S localhost:8000
```
*Backend akan aktif di `http://localhost:8000/api/`*

#### 3. Instal Dependensi & Jalankan Frontend
Buka terminal kedua dan arahkan ke folder `frontend`:
```powershell
cd "d:\BMKG 2026\SIKLIM\frontend"
npm install
npm run dev
```
*Frontend akan aktif di `http://localhost:5173/`*

---

## 📁 Struktur Direktori

```text
SIKLIM/
├── backend/                  # REST API Backend (PHP Native + PDO)
│   ├── api/                  # Endpoint API (login, siswa, soal, modul, skor, dll)
│   ├── config/               # Konfigurasi database & CORS (database.php)
│   ├── uploads/              # Direktori penyimpanan file modul/materi pembelajaran
│   │   └── modules/
│   └── database.sql          # Skema database MySQL & data awal (seed)
│
├── frontend/                 # Single Page Application (React 19 + Vite)
│   ├── public/               # Asset publik & logo BMKG
│   ├── src/
│   │   ├── components/       # Komponen UI bersama (Navbar, Sidebar, dll)
│   │   ├── pages/
│   │   │   ├── admin/        # Halaman Admin (Dashboard, Data Siswa, Modul, Soal, Skor)
│   │   │   └── siswa/        # Halaman Siswa (Scan, Biodata, Pretest, Modul, Posttest)
│   │   ├── App.jsx           # Routing aplikasi
│   │   └── index.css         # Styling kustom
│   ├── package.json          # Dependensi frontend
│   └── vite.config.js        # Konfigurasi dev server & HTTPS
│
├── start-dev.bat             # Launcher otomatis (HTTP)
├── start-dev-https.bat       # Launcher otomatis (HTTPS untuk kamera HP)
├── test_db.php               # Skrip pengujian koneksi API sederhana
└── README.md                 # Dokumentasi panduan lengkap
```

---

## 🧭 Rute & Fitur Utama

### Portal Admin:
- `/login` : Masuk akun admin
- `/dashboard` : Statistik ringkasan siswa, ujian, & skor
- `/data-siswa` : Manajemen data siswa terdaftar
- `/pengaturan-sekolah` : Manajemen data sekolah & kelas
- `/modul` & `/tambah-modul` : Manajemen materi dan modul pembelajaran
- `/soal` & `/tambah-soal` : Manajemen bank soal pre-test & post-test
- `/hasil-skor` : Laporan hasil nilai siswa & ekspor PDF laporan BMKG
- `/qr-code` : Generator cetak QR Code siswa untuk scan ujian
- `/kelola-admin` : Manajemen akun admin/operator *(Khusus Super Admin)*

### Portal Siswa:
- `/siswa/scan` : Scan barcode identitas siswa
- `/siswa/biodata` : Pendaftaran/verifikasi identitas siswa
- `/siswa/dashboard` : Halaman utama siswa
- `/siswa/pretest-info` & `/siswa/ujian` : Pengerjaan Pre-Test
- `/siswa/hasil-pretest` : Hasil nilai Pre-Test
- `/siswa/modul` : Modul & materi literasi iklim BMKG
- `/siswa/posttest-info` : Pengerjaan Post-Test
- `/siswa/hasil-posttest` : Hasil akhir perbandingan Pre-Test & Post-Test
- `/siswa/peringkat` : Leaderboard skor siswa per sekolah

---

## 📜 Lisensi & Atribusi
Hak Cipta © 2026 **BMKG Stasiun Klimatologi Lampung** & **PKL TRPL Politeknik Negeri Lampung (Polinela)**.
