import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
// import fs from 'fs'

export default defineConfig({
    server: {
        // For mobile testing:
        // host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://localhost:8080/',
                changeOrigin: true,
                followRedirects: true,
            },
        },
        open: true,
        watch: {
            usePolling: true,
        },
        // For HTTPS:
        // https: {
        //     key: fs.readFileSync('./key.pem'),
        //     cert: fs.readFileSync('./cert.pem'),
        // }
    },
    plugins: [react(), tsconfigPaths()],
    base: "./",
    build: {
        outDir: 'dist',
      },
})
