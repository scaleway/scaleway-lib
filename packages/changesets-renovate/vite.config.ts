import { defineConfig, mergeConfig } from 'vite'
import { defaultConfig } from '../../vite.config'

export default mergeConfig(defineConfig(defaultConfig), {
  build: {
    ssr: true,
    target: ['node20'],
  },
  test: {
    setupFiles: ['./vitest.setup.ts'],
  },
})
