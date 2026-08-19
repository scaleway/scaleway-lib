import { base, react, vitest, ignorePatterns } from '@scaleway/oxlint-config'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [base, react, vitest],
  ignorePatterns,
})
