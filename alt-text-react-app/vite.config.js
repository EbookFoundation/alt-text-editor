import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ["BOOK", "DATABASE"],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: { //redirect file requests to node js webserver.
      "/iframe": {
        target: "http://127.0.0.1:8080",
        secure: false,
        changeOrigin: true,
        ws: true
      },
      "/images": {
        target: "http://127.0.0.1:8080",
        secure: false,
        changeOrigin: true,
        ws: true
      },
    },
  },
})
