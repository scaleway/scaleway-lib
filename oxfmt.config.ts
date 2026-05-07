import config from '@scaleway/oxfmt-config'
import { defineConfig } from 'oxfmt'

export default defineConfig({
  ...config,
  ignorePatterns: [
    'packages_deprecated',
    'pnpm-workspace.yaml',
    '**/dist',
    '**/.turbo',
    '**/.cache',
    '**/.vite',
    '**/coverage',
    '**/*.d.ts.map',
  ],
})
