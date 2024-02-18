// import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: '@furina/app',
        description: 'furina, a sns app build with web tech',
        theme_color: '#257CC4',
        icons: [
          {
            src: '/logo.png',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        // 如果想在`vite dev`命令下调试PWA, 必须启用它
        enabled: true,
        // Vite在dev模式下会使用浏览器原生的ESModule，将type设置为`"module"`与原先的保持一致
        type: 'module',
      },
    }),
    // visualizer({
    //   gzipSize: true,
    //   brotliSize: true,
    //   emitFile: false,
    //   filename: 'test.html', //分析图生成的文件名
    //   open: true, //如果存在本地服务端口，将在打包后自动展示
    // }),
  ],
  server: {
    port: 2333,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9527',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '~': '/src',
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
})
