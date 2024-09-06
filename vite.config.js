import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 相对路径别名配置，使用 @ 代替 src
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  // scss 全局变量配置
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: '@import "./src/styles/variable.scss";',
      },
    },
  },
  // 配置代理服务器
  server: {
    // 热更新
    hmr: true,
    proxy: {
      ['/api']: {
        // 获取对应的服务器地址
        target: 'http://localhost:8080',
        // 代理跨域
        changeOrigin: true,
        // 路径重写
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
