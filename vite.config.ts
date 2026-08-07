import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3030,
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**'],
      usePolling: true,
      interval: 1000,
    },
  },
})
