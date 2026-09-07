import { defineConfig } from 'tsdown'

export const defaultConfig = defineConfig({
  dts: {
    generator: 'tsgo',
  },
  target: 'baseline-widely-available',
  platform: 'neutral',
  entry: 'src/index.ts',
  publint: true,
  unbundle: true,
  exports: true,
})
