import { defineConfig, mergeConfig } from 'tsdown'
import { defaultConfig } from '../../tsdown.config.ts'

export default mergeConfig(
  defaultConfig,
  defineConfig({
    exports: false, // Disabled because it does not handle properly types exports with multiple entries as of yet
    entry: ['src/index.ts', 'src/analytics/index.ts', 'src/cookies-consent/index.ts'],
  }),
)
