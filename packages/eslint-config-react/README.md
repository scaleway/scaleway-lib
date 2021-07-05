# `@scaleway/eslint-config-react`

A shared eslint react opiniated configuration

Available in Javascript and Typescript

---

## Install

```bash
$ yarn add --dev @scaleway/eslint-config-react
```

## Usage

Add to your `.eslintrc`

```json
{
  "extends": "@scaleway/react"
}
```

Or for Typescript
```json
{
  "extends": "@scaleway/react/typescript",
  "parserOptions": {
    "project": "./path/to/tsconfig.json"
  }
}
```
