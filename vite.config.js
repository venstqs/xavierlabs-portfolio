import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
const git = (cmd) => { try { return execSync(cmd).toString().trim() } catch { return '' } }
// Vercel CLI uploads don't include .git, so the deploy passes the commit in BUILD_COMMIT.
const commit = process.env.BUILD_COMMIT || (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || git('git rev-parse --short HEAD')
const BUILD = { commit, date: new Date().toISOString().slice(0, 10) }

export default defineConfig({
  define: { __BUILD__: JSON.stringify(BUILD) },
  plugins: [react()],
  base: './',
})
