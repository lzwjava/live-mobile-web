import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      stylus: {
        imports: [
          path.resolve(__dirname, 'src/stylus/variables.styl'),
          path.resolve(__dirname, 'src/stylus/base.styl')
        ]
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY || 'https://api.quzhiboapp.com',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'static',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
