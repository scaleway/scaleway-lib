# @scaleway/oxfmt-config

Scaleway's shareable configuration for [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html).

## Installation

```bash
npm install --save-dev @scaleway/oxfmt-config
```

## Usage

Create a `oxfmt.config.ts` file in your project root:

```ts
import config from '@scaleway/oxfmt-config'

export default config
```

Or if you want to extends defaults

```ts
import { defineConfig } from 'oxfmt'
import config, { mergeConfig } from '@scaleway/oxfmt-config'

export default mergeConfig(
  config,
  defineConfig({
    ignorePatterns: ['custom_path/**'],
  }),
)
```

## License

MIT
