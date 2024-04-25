import react from '@vitejs/plugin-react'
import browserslist from 'browserslist'
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist'
import { readPackage } from 'read-pkg'
import { type UserConfig, defineConfig } from 'vitest/config'

const pkg = await readPackage()

const externalPkgs = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.optionalDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const external = (id: string) => {
  const match = (dependency: string) => new RegExp(`^${dependency}`).test(id)
  const isExternal = externalPkgs.some(match)
  const isBundled = pkg.bundleDependencies?.some(match) // alias of bundledDependencies package.json field array

  return isExternal && !isBundled
}

const targets = resolveToEsbuildTarget(
  browserslist('defaults', {
    ignoreUnknownVersions: false,
  }),
  {
    printUnknownTargets: false,
  },
)

export const defaultConfig: UserConfig = {
  build: {
    outDir: 'dist',
    target: [...targets, 'node20'],
    minify: false,
    lib: {
      name: pkg.name,
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: (format, filename) => {
        if (format === 'es') {
          return `${filename}.js`
        }

        return `${filename}.${format}`
      },
    },
    rollupOptions: {
      external,
      output: {
        preserveModules: true,
      },
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
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
}

export default defineConfig(defaultConfig)
