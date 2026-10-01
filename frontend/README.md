# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## HTTPS lokal untuk tes kamera di HP

Kamera (scan barcode siswa) hanya bisa dipakai lewat HTTPS. Agar tidak muncul "Not secure":

1. Buat sertifikat (sekali saja, ulangi kalau IP WiFi berubah) dari Git Bash: `sh scripts/gen-cert.sh`
2. Percayai CA di laptop (Windows, akan muncul dialog konfirmasi):
   `certutil -user -addstore Root .cert\rootCA.crt`
3. Jalankan `npm run dev:https`, lalu buka `https://<IP-laptop>:5173/siswa/scan`.
4. Di HP, buka `https://<IP-laptop>:5173/rootCA.crt` untuk mengunduh CA, lalu pasang:
   - **Android:** Setelan → Keamanan → Enkripsi & kredensial → Instal sertifikat → Sertifikat CA.
   - **iPhone:** Setelan → Profil Diunduh → Instal, lalu Setelan → Umum → Mengenai → Setelan Kepercayaan Sertifikat → aktifkan "Si Iklim Muda Dev CA".

CA ini dibatasi hanya untuk `localhost` dan IP jaringan lokal. Folder `.cert/` berisi kunci privat CA dan tidak di-commit — jangan dibagikan.
Untuk mencabutnya dari Windows: `certutil -user -delstore Root "Si Iklim Muda Dev CA"`.
