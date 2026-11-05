import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Configurarea Vite (serverul de dezvoltare pentru React)
// Documentatie: https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // accesibil din afara containerului (din browserul vostru)
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true // necesar pe Windows + Docker, ca modificarile sa se vada imediat
    }
  }
})
