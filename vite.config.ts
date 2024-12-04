import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  root: "src",
  plugins: [react(), vanillaExtractPlugin()],
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html")
      },
      output: {
        entryFileNames: "assets/bundle.js"
      }
    }
  }
})
