import { defineConfig, mergeConfig } from 'vite'
import { defaultConfig } from '../../vite.config'
import { defaultConfig as vitestDefaultConfig } from '../../vitest.config'

const config = {
  ...defineConfig(defaultConfig),
  ...vitestDefaultConfig,
}

export default mergeConfig(config, {
  build: {
    lib: {
      formats: ['es', 'cjs'],
      entry: [
        'src/index.ts',
        'src/analytics/index.ts',
        'src/cookies-consent/index.ts',
      ],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
