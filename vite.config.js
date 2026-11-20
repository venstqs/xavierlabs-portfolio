import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
const git = (cmd) => { try { return execSync(cmd).toString().trim() } catch { return '' } }
const BUILD = { commit: git('git rev-parse --short HEAD'), date: new Date().toISOString().slice(0, 10) }

export default defineConfig({
  define: { __BUILD__: JSON.stringify(BUILD) },
  plugins: [react()],
  base: './',
})
