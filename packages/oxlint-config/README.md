# @scaleway/oxlint-config

Scaleway's shareable configuration for [oxlint](https://oxc.rs/docs/guide/usage/linter.html).

> ⚠️ This package does not follow semver for now. Breaking can be introduced in minor/patch versions

## Installation

```bash
npm install --save-dev @scaleway/oxlint-config
```

## Usage

Create a `.oxlintrc.json` file in your project root:

```json
{
  "extends": ["./node_modules/@scaleway/oxlint-config/configs/index.json"]
}
```

### Framework-Specific Configurations

#### React

For React projects, extend the React configuration:

```json
{
  "extends": [
    "./node_modules/@scaleway/oxlint-config/configs/index.json",
    "./node_modules/@scaleway/oxlint-config/configs/react.json"
  ]
}
```

## Available Configurations

1. **Base rules** (`@scaleway/oxlint-config`): Core rules for all JavaScript/TypeScript projects
2. **React rules** (`@scaleway/oxlint-config/react`): React-specific rules

## License

MIT
