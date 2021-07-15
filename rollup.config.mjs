import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import builtins from 'builtin-modules'
import { readPackageAsync } from 'read-pkg'
import dts from 'rollup-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'

const PROFILE = !!process.env.PROFILE

const getConfig = (pkg, isBrowser = false) => {
  const targets = isBrowser
    ? `
    > 1%,
    last 2 versions,
    not IE > 0,
    not IE_Mob > 0
  `
    : { node: 'current' }

  const external = id =>
    [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...(isBrowser ? [] : builtins),
    ].find(dep => new RegExp(`^${dep}`).test(id))

  return {
    external,
    input: './src/index.ts',
    output: {
      file: isBrowser ? 'dist/index.browser.js' : 'dist/index.js',
      format: 'es',
    },
    plugins: [
      babel({
        babelHelpers: 'runtime',
        babelrc: false,
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.es', '.mjs'],
        plugins: [
          '@babel/plugin-transform-runtime',
          '@babel/plugin-transform-react-jsx',
        ],
        presets: [
          '@babel/preset-typescript',
          ['@babel/env', { modules: false, targets }],
        ],
      }),
      nodeResolve({
        browser: isBrowser,
        extensions: [ '.mjs', '.js', '.json', '.ts', '.tsx' ],
        preferBuiltins: true,
      }),
      PROFILE &&
        visualizer({
          brotliSize: true,
          filename: '.reports/report.html',
          gzipSize: true,
          open: true,
        }),
    ].filter(Boolean),
  }
}

export default async () => {
  const pkg = await readPackageAsync()

  const doesAlsoTargetBrowser = 'browser' in pkg

  return [
    getConfig(pkg),
    doesAlsoTargetBrowser && getConfig(pkg, true),
    {
      input: './src/index.ts',
      output: [{ file: 'dist/index.d.ts', format: 'es' }],
      plugins: [dts()],
    },
  ].filter(Boolean)
}
