import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Deploying under a sub-path (e.g. GitHub Pages project site
 * https://<user>.github.io/<repo>/) needs a matching base:
 *   VITE_BASE=/<repo>/ npm run build
 * The default works for a root domain, Netlify, and local preview.
 */
const base = process.env.VITE_BASE ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true  // Enable PWA in development mode
      },
      includeAssets: ['favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        name: '番茄钟 · 专注学习计时',
        short_name: '番茄钟',
        description: '设置学习与休息时长，到点响铃提醒继续学习，并自动记录每天的学习总时长。',
        lang: 'zh-CN',
        theme_color: '#f4f7f7',
        background_color: '#f4f7f7',
        display: 'standalone',
        // iOS ignores orientation, so 'any' plus a responsive layout is the
        // only portable way to support landscape/portrait on iPhone.
        orientation: 'any',
        // Relative values keep the manifest valid under any deploy sub-path.
        scope: './',
        start_url: './',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // mp3 is included so the end-of-session alarm still rings offline.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,mp3}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'meghann-probanishment-slavishly.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok.io',
      '.ngrok-free.app'
    ]
  },
  test: {
	environment: 'jsdom',
	globals: true,
	css: true,
  }
})
