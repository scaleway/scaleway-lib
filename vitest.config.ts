import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export const defaultConfig = defineConfig({
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
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
    },
    css: true,
    environment: 'node',
    exclude: ['node_modules', '**/dist/**', '**/__typetests__/**'],
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

    typecheck: {
      enabled: true,

      include: ['**/__typetests__/**/*.test.?(c|m)[jt]s?(x)'],
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
})
