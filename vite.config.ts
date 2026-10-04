import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// WebXR / camera APIs need a secure context. On localhost that's automatic;
// on a phone over LAN use `npm run dev` + an https tunnel (e.g. `npx localtunnel`) or ngrok.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
})
