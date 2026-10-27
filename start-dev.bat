@echo off
title Si Iklim Muda BMKG - Launcher
color 0A

echo ========================================================
echo       BMKG - SI IKLIM MUDA (DEVELOPMENT LAUNCHER)
echo ========================================================
echo.

:: 1. Cek direktori
cd /d "%~dp0"

:: 2. Jalankan Backend PHP di window terpisah
echo [1/3] Menjalankan Backend PHP Server (Port 8000)...
start "Backend PHP (Port 8000)" cmd /k "cd /d ""%~dp0backend"" && title Backend PHP Server (Port 8000) && color 0B && echo Menjalankan PHP Server di http://localhost:8000 ... && php -S localhost:8000"

:: 3. Jalankan Frontend Vite di window terpisah
echo [2/3] Menjalankan Frontend Vite Server (Port 5173)...
start "Frontend Vite (Port 5173)" cmd /k "cd /d ""%~dp0frontend"" && title Frontend Vite Dev Server (Port 5173) && color 0E && echo Menjalankan Vite Dev Server di http://localhost:5173 ... && npm.cmd run dev"

:: 4. Tunggu sebentar lalu buka browser
echo [3/3] Menyiapkan browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================================
echo   Kedua server sudah berjalan di jendela terminal masing-masing!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8000
echo ========================================================
echo.
pause
