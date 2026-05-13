import { defineConfig, mergeConfig } from 'tsdown'
import { defaultConfig } from '../../tsdown.config.ts'

export default mergeConfig(
  defaultConfig,
  defineConfig({
    entry: ['src/index.ts', 'src/analytics/index.ts', 'src/cookies-consent/index.ts'],
  }),
)
