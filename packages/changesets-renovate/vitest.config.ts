import { mergeConfig } from 'vitest/config'
import { defaultConfig } from '../../vitest.config'

export default mergeConfig(defaultConfig, {
  test: {
    setupFiles: ['./vitest.setup.ts', '@testing-library/jest-dom/vitest'],
  },
})
