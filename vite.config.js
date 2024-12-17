import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "/runtime/v1": path.resolve(import.meta.dirname, "./node_modules/@opendatacapture/runtime-v1/dist/")
    }
  }
})
