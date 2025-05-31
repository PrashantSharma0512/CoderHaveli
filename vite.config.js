import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://coderhaveli-com.onrender.com', // Replace with your backend server URL
        changeOrigin: true,
        secure: false,
        ws:true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
 