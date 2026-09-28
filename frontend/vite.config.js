import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // Supaya bisa diakses dari HP di jaringan WiFi yang sama
    port: 5173,
  }
})
