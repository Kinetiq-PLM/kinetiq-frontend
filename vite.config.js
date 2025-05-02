import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcssPlugin from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [react()],
  base: './',
  css: {
    postcss: {
      plugins: [
        tailwindcssPlugin,
        autoprefixer,
      ],
    },
  },
})