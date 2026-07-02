import { mergeConfig } from 'vitest/config'
import { defaultConfig } from '../../vitest.config'

export default mergeConfig(defaultConfig, {
  test: {
    // We use happy-dom here because jsdom does not handle navigation
    // https://github.com/jsdom/jsdom/issues/2112
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts', '@testing-library/jest-dom/vitest'],
  },
})
