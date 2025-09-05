import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    viteCompression({
      filter: /\.(js|css|json|txt|ico|svg)(\?.*)?$/i, // 需要压缩的文件
      threshold: 1024, // 文件容量大于这个值进行压缩
      algorithm: 'gzip', // 压缩方式
      ext: 'gz', // 后缀名
      // algorithm: 'brotliCompress',
      // ext: '.br',
      deleteOriginFile: false, // 压缩后是否删除压缩源文件
    }),
  ],
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
        // api: 'modern-compiler',
        javascriptEnabled: true,
        // additionalData: '@import "./src/styles/variable.scss";',
        additionalData: `@use "./src/styles/variable.scss" as *;`,
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
  // 打包配置
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
})
