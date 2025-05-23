import { defineConfig, mergeConfig } from 'vite'
import { defaultConfig } from '../../vite.config'
import { defaultConfig as vitestDefaultConfig } from '../../vitest.config'

const config = {
  ...defineConfig(defaultConfig),
  ...vitestDefaultConfig,
}

export default mergeConfig(config, {
  test: {
    // environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
