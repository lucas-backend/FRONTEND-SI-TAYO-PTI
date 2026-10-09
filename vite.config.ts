import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) return 'leaflet'
          if (id.includes('node_modules/@turf')) return 'turf'
          if (id.includes('node_modules/recharts')) return 'recharts'
          return undefined
        },
      },
    },
  },
})