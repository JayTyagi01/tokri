import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5222,
    strictPort: true,
    allowedHosts: [
      'tokriii.com',
      'www.tokriii.com',
    ],
  },
  preview: {
    host: true,
    port: 5222,
    strictPort: true,
    allowedHosts: [
      'tokriii.com',
      'www.tokriii.com',
    ],
  },
})
