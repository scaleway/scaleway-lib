import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import builtins from 'builtin-modules'
import { readPackageAsync } from 'read-pkg'
import analyze from 'rollup-plugin-analyzer'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';

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
        presets: [['@babel/env', { modules: false, targets }]],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
      nodeResolve({
        browser: isBrowser,
        preferBuiltins: true,
      }),
      commonjs({
        include: '**/node_modules/**',
      }),
      preserveShebangs(),
      PROFILE && analyze({ summaryOnly: true }),
    ].filter(Boolean),
    external,
    output: [
      {
        format: 'umd',
        name: pkg.name,
        file: isBrowser ? 'dist/index.browser.js' : 'dist/index.js',
      },
      {
        format: 'es',
        file: isBrowser ? 'dist/module.browser.js' : 'dist/module.js',
      },
    ],
  }
}

export default async () => {
  const pkg = await readPackageAsync()

  const doesAlsoTargetBrowser = 'browser' in pkg

  return [getConfig(pkg), doesAlsoTargetBrowser && getConfig(pkg, true)].filter(
    Boolean,
  )
}
