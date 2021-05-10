import { babel } from '@rollup/plugin-babel'
import builtins from 'builtin-modules'
import { readPackageAsync } from 'read-pkg'
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
    : { node: '14' }

  const external = id =>
    [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...(isBrowser ? [] : builtins),
    ].find(dep => new RegExp(`^${dep}`).test(id))

  return {
    input: './src/index.js',
    plugins: [
      babel({
        babelHelpers: 'runtime',
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
          ['@babel/env', { modules: false, targets }],
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
          '@babel/plugin-transform-react-jsx',
        ],
      }),
      PROFILE &&
        visualizer({
          gzipSize: true,
          brotliSize: true,
          open: true,
          filename: '.reports/report.html',
        }),
    ].filter(Boolean),
    external,
    output: [{
      format: 'es',
      file: isBrowser ? 'dist/module.browser.js' : 'dist/module.js',
    }],
  }
}

export default async () => {
  const pkg = await readPackageAsync()

  const doesAlsoTargetBrowser = 'browser' in pkg

  return [getConfig(pkg), doesAlsoTargetBrowser && getConfig(pkg, true)].filter(
    Boolean,
  )
}
