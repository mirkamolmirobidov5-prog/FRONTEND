import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev paytida /api/* so'rovlari backend (5000-port) ga yo'naltiriladi — CORS muammosi bo'lmaydi
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
})
