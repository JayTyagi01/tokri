import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5222,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 5222,
    strictPort: true,
  },
})
