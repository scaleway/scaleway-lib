import { mergeConfig } from 'vite'
import { defaultConfig } from '../../vite.config'
import { defaultConfig as vitestDefaultConfig } from '../../vitest.config'

const config = mergeConfig(defaultConfig, vitestDefaultConfig)

export default mergeConfig(config, {
  build: {
    lib: {
      entry: 'src/cli.ts',
      fileName: (format: string, filename: string) => {
        if (format === 'es') {
          return `${filename}.js`
        }

        return `${filename}.${format}`
      },
      formats: ['es'],
      name: '@scaleway/changesets-renovate',
    },
    ssr: true,
    target: ['node20'],
  },
  test: {
    setupFiles: ['./vitest.setup.ts'],
  },
})
