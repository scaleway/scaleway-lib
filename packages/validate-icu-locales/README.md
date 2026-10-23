# `@scaleway/validate-icu-locales`

## A tiny cli to handle ICU errors on locale files

## Install

Requirements

- Node should be installed

```bash
pnpm add -D @scaleway/validate-icu-locales
```

## Usage

We can parse JSON, TS and JS if these files use default export.

```text
validate-icu "../**/en.json"
```

If there is an error on a locale, the CLI will throw an Error and print all errors.

### Options

#### `--ignoreTag` (or `-i`)

Treat tags like `<b>...</b>` as plain text instead of parsing them:

```text
validate-icu "../**/en.json" --ignoreTag
```

Tag errors such as `UNCLOSED_TAG` are skipped; every other ICU error is still reported.

## Error

```text
export default from:  ../src/__tests__/locales/en-1.js  is not an object
{
  errors: [
    {
      message: 'EXPECT_ARGUMENT_CLOSING_BRACE',
      value: '{count, plural, =0 {Minute} =1 {Minute} other {Minutes',
      key: 'units.minutes.label',
      filePath: '../../packages/validate-icu-locales/src/__tests__/locales/en.js'
    },
    {
      message: 'EXPECT_ARGUMENT_CLOSING_BRACE',
      value: '{count, plural, =0 {Minute} =1 {Minute} other {Minutes',
      key: 'units.minutes.label',
      filePath: '../../packages/validate-icu-locales/src/__tests__/locales/en.json'
    },
    {
      message: 'EXPECT_ARGUMENT_CLOSING_BRACE',
      value: '{count, plural, =0 {Minute} =1 {Minute} other {Minutes',
      key: 'units.minutes.label',
      filePath: '../../packages/validate-icu-locales/src/__tests__/locales/en.ts'
    }
  ]
}
```
