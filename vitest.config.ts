import { defineConfig, mergeConfig } from 'vitest/config'
import { defaultConfig as viteConfig } from './vite.config'

export const defaultConfig = mergeConfig(viteConfig, {
  test: {
    allowOnly: false,
    clearMocks: true,
    coverage: {
      exclude: [
        '**/__typetests__/**',
        '.reports/**',
        '.turbo',
        '**/.eslintrc.*',
        '**/*.d.ts',
        'build',
        'dist',
        'node_modules',
        '**/{webpack,vite,vitest,babel}.config.*',
        '**.snap',
        '**.svg',
      ],
      provider: 'istanbul',
      reporter: ['json-summary', 'cobertura'],
    },
    css: true,
    environment: 'node',
    exclude: ['**/__typetests__/**', 'node_modules', '**/dist/**'],
    globals: true,
    logHeapUsage: true,
    mockReset: true,
    name: 'lib',
    reporters: ['default'],
    restoreMocks: true,
    server: {
      deps: {
        inline: true,
      },
    },
    setupFiles: ['vitest-localstorage-mock'],
  },
})

export default defineConfig(defaultConfig)
