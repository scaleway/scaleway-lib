import { mergeConfig } from 'vitest/config'
import { defaultConfig } from '../../vitest.config'

export default mergeConfig(defaultConfig, {
  test: {
    environment: 'node',
    setupFiles: ['@testing-library/jest-dom/vitest'],
  },
})
