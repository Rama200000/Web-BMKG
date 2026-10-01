import fs from 'node:fs'
import http from 'node:http'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'

const certDir = new URL('./.cert/', import.meta.url)
const hasLocalCert = ['cert.pem', 'key.pem', 'rootCA.crt'].every((f) => fs.existsSync(new URL(f, certDir)))

// Menyajikan sertifikat CA (bagian publik saja) di /rootCA.crt
// agar mudah dipasang sebagai tepercaya di HP
const serveRootCA = () => ({
  name: 'serve-root-ca',
  configureServer(server) {
    server.middlewares.use('/rootCA.crt', (_req, res) => {
      res.setHeader('Content-Type', 'application/x-x509-ca-cert')
      res.setHeader('Content-Disposition', 'attachment; filename="SiIklimMuda-DevCA.crt"')
      res.end(fs.readFileSync(new URL('rootCA.crt', certDir)))
    })
  },
})

// Dev only: memberi tahu halaman admin alamat WiFi dev server (mis. https://192.168.1.39:5175),
// supaya QR Code yang dibuat saat admin membuka `localhost` tetap bisa dibuka dari HP
const serveLanOrigin = () => ({
  name: 'serve-lan-origin',
  configureServer(server) {
    server.middlewares.use('/__dev/lan-origin', (_req, res) => {
      const urls = server.resolvedUrls?.network ?? []
      const url = urls.find((u) => u.includes('://192.168.')) ?? urls[0]
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ origin: url ? new URL(url).origin : null }))
    })
  },
})

const DEV_PORT = 5173
// Alamat lama (http://…:5174, dari QR / riwayat browser sebelumnya) → dialihkan ke https://…:5173
const LEGACY_HTTP_PORT = 5174

const redirectLegacyHttp = () => ({
  name: 'redirect-legacy-http',
  configureServer(server) {
    const redirect = http.createServer((req, res) => {
      const host = (req.headers.host || 'localhost').replace(/:\d+$/, '')
      res.writeHead(307, { Location: `https://${host}:${DEV_PORT}${req.url}` })
      res.end()
    })
    redirect.on('error', (err) => {
      server.config.logger.warn(`  Pengalihan http://…:${LEGACY_HTTP_PORT} tidak aktif (${err.code})`)
    })
    redirect.listen(LEGACY_HTTP_PORT)
    server.httpServer?.on('close', () => redirect.close())
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // `npm run dev:https` → HTTPS, wajib agar kamera HP (scan barcode) bisa diakses lewat IP WiFi.
  // Pakai sertifikat dari `sh scripts/gen-cert.sh` (tepercaya, tanpa "Not secure") bila ada,
  // selain itu sertifikat self-signed sementara.
  const https = mode === 'https'
  const useLocalCert = https && hasLocalCert

  return {
    plugins: [
      react(),
      serveLanOrigin(),
      ...(https && !useLocalCert ? [basicSsl()] : []),
      ...(useLocalCert ? [serveRootCA()] : []),
      ...(https ? [redirectLegacyHttp()] : []),
    ],
    server: {
      host: true,   // Supaya bisa diakses dari HP di jaringan WiFi yang sama
      port: DEV_PORT,
      // Port tetap: kalau 5173 dipakai proses lain, gagal dengan jelas alih-alih pindah ke 5174/5175
      // (port yang berpindah membuat link & QR Code yang sudah dicetak jadi tidak valid)
      strictPort: true,
      ...(useLocalCert && {
        https: {
          cert: fs.readFileSync(new URL('cert.pem', certDir)),
          key: fs.readFileSync(new URL('key.pem', certDir)),
        },
      }),
    },
  }
})
