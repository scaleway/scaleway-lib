import { defineConfig } from 'tsdown'
import { defaultConfig } from '../../tsdown.config.ts'

export default defineConfig({
  ...defaultConfig,
  copy: [
    {
      from: 'src/global.d.ts',
      to: 'dist',
      rename: 'global.d.ts',
    },
  ],
})
