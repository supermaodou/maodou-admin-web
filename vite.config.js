import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    // port: 3000, // 前端服务端口
    proxy: {
      '/api': {
        target: 'http://localhost:8088', // 后端服务器地址
        changeOrigin: true, // 支持跨域
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径，去掉 /api 前缀
      }
    }
  }
})
