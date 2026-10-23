import { playwright } from '@vitest/browser-playwright'
import { mergeConfig } from 'vitest/config'
import { defaultConfig } from '../../vitest.config'

export default mergeConfig(defaultConfig, {
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      // headless defaults to process.env.CI, so local runs stay headful for debugging
      instances: [{ browser: 'chromium' }],
    },
  },
})
