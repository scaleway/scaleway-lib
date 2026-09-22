import { defineConfig, mergeConfig } from 'tsdown'
import { defaultConfig } from '../../tsdown.config.ts'

export default mergeConfig(
  defaultConfig,
  defineConfig({
    exports: false,
    dts: false,
    platform: 'node',
    target: ['node24'],
    entry: 'src/cli.ts',
  }),
)
