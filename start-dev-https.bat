@echo off
title Si Iklim Muda BMKG - Launcher HTTPS (Akses HP & Kamera)
color 0B

echo ========================================================
echo   BMKG - SI IKLIM MUDA (LAUNCHER MODE HTTPS / KAMERA HP)
echo ========================================================
echo.

:: 1. Cek direktori
cd /d "%~dp0"

:: 2. Jalankan Backend PHP di window terpisah
echo [1/3] Menjalankan Backend PHP Server (Port 8181)...
start "Backend PHP (Port 8181)" cmd /k "cd /d ""%~dp0backend"" && title Backend PHP Server (Port 8181) && color 0B && echo Menjalankan PHP Server di http://0.0.0.0:8181 ... && php -S 0.0.0.0:8181"

:: 3. Jalankan Frontend Vite HTTPS di window terpisah
echo [2/3] Menjalankan Frontend Vite Server Mode HTTPS (Port 5173)...
start "Frontend Vite HTTPS (Port 5173)" cmd /k "cd /d ""%~dp0frontend"" && title Frontend Vite HTTPS (Port 5173) && color 0E && echo Menjalankan Vite Dev Server HTTPS di https://localhost:5173 ... && npm.cmd run dev:https"

:: 4. Tunggu sebentar lalu buka browser
echo [3/3] Menyiapkan browser...
timeout /t 3 /nobreak >nul
start https://localhost:5173

echo.
echo ========================================================
echo   Server mode HTTPS aktif untuk akses kamera & scan barcode!
echo   Frontend : https://localhost:5173
echo   Backend  : http://10.21.224.6:8181 (0.0.0.0:8181)
echo ========================================================
echo.
pause
