import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
// import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        // For mobile testing:
        // host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://localhost:8080/',
                changeOrigin: true,
                followRedirects: true,
                // secure: false,
            },
        },
        open: true,
        // For HMR on WSL - TODOFINAL
        watch: {
            usePolling: true,
        },
        // https: {
        //     key: fs.readFileSync('./key-nopass.pem'),
        //     cert: fs.readFileSync('./cert.pem'),
        // }
    },
    // tsconfigPaths is so the src dir is the base url - TODOFINAL
    plugins: [react(), tsconfigPaths()],
    base: "./frontend",
    build: {
        outDir: 'dist',
      },
})
