import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('kanjiData')) return 'data-kanji';
          if (id.includes('vocabData')) return 'data-vocab';
          if (id.includes('grammarData')) return 'data-grammar';
        },
      },
    },
  },
})

