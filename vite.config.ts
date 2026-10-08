import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
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
