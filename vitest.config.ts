import { defineConfig, mergeConfig } from 'vitest/config'
import { defaultConfig as viteConfig } from './vite.config'

export const defaultConfig = mergeConfig(viteConfig, {
  test: {
    name: 'lib',
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    environment: 'node',
    setupFiles: ['vitest-localstorage-mock'],
    server: {
      deps: {
        inline: true,
      },
    },
    allowOnly: false,
    css: true,
    logHeapUsage: true,
    reporters: ['default'],
    exclude: ['**/__typetests__/**', 'node_modules', '**/dist/**'],
    coverage: {
      provider: 'istanbul',
      reporter: ['json-summary', 'cobertura'],
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
    },
  },
})

export default defineConfig(defaultConfig)
