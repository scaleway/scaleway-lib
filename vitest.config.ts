import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
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
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov', 'cobertura'],
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
    browser: {
      // shared browser-mode setup; a package opts in with `browser.enabled: true` in its own vitest.config.ts
      provider: playwright(),
      // always headless: local runs must not open browser windows (CI is headless anyway)
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
    server: {
      deps: {
        inline: true,
      },
    },

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
