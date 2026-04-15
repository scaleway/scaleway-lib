import { defineConfig, mergeConfig } from 'vitest/config'
import { defaultConfig as viteConfig } from './vite.config'
import type { Plugin } from 'vitest/config'
/**
 * @deprecated https://github.com/vitest-dev/vitest/issues/9935
 */
export const coveragePluginIssue = function fixIstanbulBabelInterop(): Plugin {
  return {
    name: 'fix-istanbul-babel-interop',
    transform(code, id) {
      if (!id.includes('coverage-istanbul/dist/provider')) {
        return null
      }
      // Replace the default import with a namespace import so Vite's SSR
      // transform doesn't wrap it in .default (which loses CJS exports)
      return code.replace(
        "import require$$0$3 from '@babel/core';",
        () => "import * as require$$0$3 from '@babel/core';",
      )
    },
  }
}

export const defaultConfig = mergeConfig(viteConfig, {
  plugins: [coveragePluginIssue()],
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
})

export default defineConfig(defaultConfig)
