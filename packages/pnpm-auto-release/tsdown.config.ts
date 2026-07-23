import { defineConfig, mergeConfig } from 'tsdown'
import { defaultConfig } from '../../tsdown.config.ts'

export default mergeConfig(
  defaultConfig,
  defineConfig({
    exports: true,
    dts: false,
    platform: 'node',
    target: ['node24'],
  }),
)
