# @scaleway/oxfmt-config

Scaleway's shareable configuration for [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html).

## Installation

```bash
npm install --save-dev @scaleway/oxfmt-config
```

## Usage

Create a `oxfmt.config.ts` file in your project root:

```ts
import { defineConfig } from 'oxfmt'
import config from '@scaleway/oxfmt-config'

export default defineConfig({
  ...config,
  singleQuote: false,
})
```

## License

MIT
