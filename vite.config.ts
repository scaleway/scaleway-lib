import react from '@vitejs/plugin-react'
import browserslist from 'browserslist'
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist'
import { readPackage } from 'read-pkg'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'

const pkg = await readPackage()

const externalPkgs = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.optionalDependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]

const external = (id: string) => {
  const match = (dependency: string) => new RegExp(`^${dependency}`).test(id)
  const isExternal = externalPkgs.some(p => match(p))
  // alias of bundledDependencies package.json field array
  const isBundled = pkg.bundleDependencies?.some(dep => !dep) ?? false

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
    lib: {
      entry: 'src/index.ts',
      fileName: (format, filename) => {
        if (format === 'es') {
          return `${filename}.js`
        }

        return `${filename}.${format}`
      },
      formats: ['es'],
      name: pkg.name,
    },
    minify: false,
    outDir: 'dist',
    rollupOptions: {
      external,
      output: {
        preserveModules: true,
      },
    },
    target: [...targets, 'node20'],
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
}

export default defineConfig(defaultConfig)
