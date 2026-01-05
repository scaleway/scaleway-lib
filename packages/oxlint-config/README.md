# @scaleway/oxlint-config

Scaleway's shareable configuration for [oxlint](https://oxc.rs/docs/guide/usage/linter.html).

## Installation

```bash
npm install --save-dev @scaleway/oxlint-config
```

## Usage

Create a `.oxlintrc.json` file in your project root:

```json
{
  "extends": ["@scaleway/oxlint-config"]
}
```

### Framework-Specific Configurations

#### React

For React projects, extend the React configuration:

```json
{
  "extends": ["@scaleway/oxlint-config", "@scaleway/oxlint-config/react"]
}
```

#### TypeScript

For TypeScript projects, extend the TypeScript configuration:

```json
{
  "extends": ["@scaleway/oxlint-config", "@scaleway/oxlint-config/typescript"]
```

}

#### Combined React and TypeScript

For React projects using TypeScript, extend both configurations:

```json
{
  "extends": [
    "@scaleway/oxlint-config",
    "@scaleway/oxlint-config/react",
    "@scaleway/oxlint-config/typescript"
  ]
}
```

## Available Configurations

1. **Base rules** (`@scaleway/oxlint-config`): Core rules for all JavaScript/TypeScript projects
2. **React rules** (`@scaleway/oxlint-config/react`): React-specific rules
3. **TypeScript rules** (`@scaleway/oxlint-config/typescript`): TypeScript-specific rules

## License

MIT