# @scaleway/biome

Scaleway's shareable configuration for [biome](https://biomejs.dev/).

## Installation

```bash
npm install --save-dev @scaleway/biome
```

## Usage

Create a `biome.jsonc` file in your project root:

```json
{
  "extends": ["@scaleway/biome/core.jsonc]
}
```

### Framework-Specific Configurations

#### React

For React projects, extend the React configuration:

```json
{
  "extends": ["@scaleway/biome/core", "@scaleway/biome/react"]
}
```

#### Next

For Next projects, extend the Next configuration:

```json
{
  "extends": ["@scaleway/biome/core", "@scaleway/biome/next"]
}
```

## Available Configurations

1. **Base rules** (`@scaleway/biome/core`): Core rules for all JavaScript/TypeScript projects
2. **React rules** (`@scaleway/biome/react`): React-specific rules
3. **Next rules** (`@scaleway/biome/next`): Next-specific rules

## License

MIT
