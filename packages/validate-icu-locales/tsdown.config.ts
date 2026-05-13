import { defineConfig, mergeConfig } from 'tsdown'
import { defaultConfig } from '../../tsdown.config.ts'

export default mergeConfig(
  defaultConfig,
  defineConfig({
    dts: false,
    platform: 'node',
    target: ['node24'],
  }),
)
