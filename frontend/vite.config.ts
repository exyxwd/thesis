import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080/',
                changeOrigin: true,
                followRedirects: true,
            },
        },
        open: true,
        // For HMR on WSL - TODOFINAL
        watch: {
            usePolling: true,
        }
    },
    // tsconfigPaths is so the src dir is the base url - TODOFINAL
    plugins: [react(), tsconfigPaths()],
    base: "./frontend",
    build: {
        outDir: 'dist',
      },
})
