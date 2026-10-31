import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative base is required for Capacitor Android WebView asset loading.
  base: './',
  plugins: [react(), tailwindcss()],
})
