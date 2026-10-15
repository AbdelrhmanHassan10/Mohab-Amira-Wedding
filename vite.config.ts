import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Link previews (WhatsApp, Facebook) need absolute URLs, so %SITE_URL% in index.html
  // becomes the real address from VITE_SITE_URL (falls back to a relative path locally)
  const siteUrl = (loadEnv(mode, process.cwd()).VITE_SITE_URL ?? '').replace(/\/$/, '')

  return {
    plugins: [
      react(),
      {
        name: 'site-url',
        transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
      },
    ],
  }
})
