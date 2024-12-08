import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'
const SERVER_HOST = "127.0.0.1";
const SERVER_PORT = 5173;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
  ],
  server: {
    host: SERVER_HOST,
    port: SERVER_PORT,
  },
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
