import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'NihongoMaster — Belajar Bahasa Jepang 0 ke N1',
        short_name: 'NihongoMaster',
        description: 'Aplikasi belajar bahasa Jepang interaktif komprehensif dari 0 hingga JLPT N1 (Kanji, Kosakata, Grammar, Partikel, SRS & Simulasi Ujian).',
        theme_color: '#c84b31',
        background_color: '#faf8f5',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('kanji')) return 'data-kanji';
          if (id.includes('grammar')) return 'data-grammar';
          if (id.includes('vocabN5') || id.includes('N5Complete') || id.includes('n5')) return 'data-vocab-n5';
          if (id.includes('vocabN4') || id.includes('N4Complete') || id.includes('n4')) return 'data-vocab-n4';
          if (id.includes('vocabN3') || id.includes('N3Complete') || id.includes('n3')) return 'data-vocab-n3';
          if (id.includes('vocabN2') || id.includes('N2Complete') || id.includes('n2')) return 'data-vocab-n2';
          if (id.includes('vocabN1') || id.includes('N1Complete') || id.includes('n1')) return 'data-vocab-n1';
          if (id.includes('vocab')) return 'data-vocab';
        },
      },
    },
  },
})
