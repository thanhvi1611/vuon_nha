import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),

    // ✅ PWA phải nằm ở đây
    VitePWA({
      registerType: 'prompt',

      manifest: {
        name: 'Vườn Nhà 🌱',
        short_name: 'VuonNha',
        description: 'Quản lý chăm sóc cây trồng',

        theme_color: '#22c55e',
        background_color: '#ffffff',

        display: 'standalone',
        orientation: 'portrait',

        start_url: '/',

        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  optimizeDeps: {
    exclude: ['firebase-admin'],
  },
})
