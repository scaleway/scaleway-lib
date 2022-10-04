# `@scaleway/outdated-browser`

A small web script to display outdated banner

---

## Install

```bash
$ pnpm add @scaleway/outdated-browser
```

## Usage

This package is intended to be used in tandem with a bundler
Only one parameter is required, a regex of accepted browser user agents

Example with webpack:
```js
import { getUserAgentRegExp } from 'browserslist-useragent-regexp'

const SUPPORTED_BROWSERS = getUserAgentRegExp({
  browsers: '> 1%, last 2 versions, Firefox ESR, not IE > 0, not IE_Mob > 0',
  allowHigherVersions: true,
  ignoreMinor: true,
  ignorePatch: true,
}).toString()

export default {
  entry: {
    outdated: '@scaleway/outdated-browser',
    main: './src/index.tsx',
  },
  plugins: [
    new webpack.DefinePlugin({
      SUPPORTED_BROWSERS,
    }),
  ],
}
```
