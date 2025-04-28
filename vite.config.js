import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "/runtime/v1": path.resolve(__dirname, "./node_modules/@opendatacapture/runtime-v1/dist/")
    }
  }
})
