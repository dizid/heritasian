import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin'
import { fileURLToPath } from 'url'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    vue(),
    tailwindcss(),
    // Netlify plugin only needed for client build (function bundling + dev middleware)
    ...(!isSsrBuild ? [netlify()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
