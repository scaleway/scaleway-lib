# `@scaleway/validate-icu-locales`

## A tiny cli to handle ICU errors on locales files.

## Install

Requirements

- Node should be installed

```bash
$ pnpm add -D @scaleway/validate-icu-locales
```

## Usage

We can parse JSON, TS and JS if theses files use default export.

```
validate-icu "../**/en.json"
```

If there is an error on a local, the CLI will throw an Error and print all errors.

## Error

```
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
