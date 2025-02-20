import { defineConfig, mergeConfig } from 'vite'
import { defaultConfig } from '../../vite.config'

const config = {
  ...defineConfig(defaultConfig),
}
export default mergeConfig(config, {
  build: {
    lib: {
      entry: 'src/cli.ts',
      formats: ['cjs'],
    },
    minify: true,
    rollupOptions: {
      preserveSymlinks: true,
      input: 'src/cli.ts',
      output: {
        preserveModules: false,
        banner: '#!/usr/bin/env node',
        interop: 'compat',
        manualChunks: {},
      },
    },
  },
})
