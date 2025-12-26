import { mergeConfig } from 'vite'
import { defaultConfig } from '../../vite.config'
import { defaultConfig as vitestDefaultConfig } from '../../vitest.config'

const config = mergeConfig(defaultConfig, vitestDefaultConfig)

export default mergeConfig(config, {
  build: {
    lib: {
      entry: [
        'src/index.ts',
        'src/analytics/index.ts',
        'src/cookies-consent/index.ts',
      ],
      formats: ['es', 'cjs'],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
