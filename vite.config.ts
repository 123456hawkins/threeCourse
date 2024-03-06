import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    topLevelAwait()
  ],
  build: {
    target: 'esnext'
  },
  resolve: {
    alias: {
      '@': path.resolve('./src'), //路径相对别名，用@代替src
    },
  },
})
