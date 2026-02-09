import react from '@vitejs/plugin-react'
// import browserslist from 'browserslist'
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
    license: true,
    minify: false,
    outDir: 'dist',
    rolldownOptions: {
      experimental: {
        lazyBarrel: false,
      },
      external,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      platform: 'browser',
      preserveEntrySignatures: 'exports-only',
      treeshake: true,
      tsconfig: true,
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
}

export default defineConfig(defaultConfig)
