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

A malformed file fails the run too: broken JSON (`INVALID_JSON`), a module that fails to import (`IMPORT_FAILED`), no default export (`MISSING_DEFAULT_EXPORT`), or a default export that is not an object of string values — an array included (`INVALID_LOCALES_FILE`).

### Options

#### `--ignoreTag` (or `-i`)

Treat tags like `<b>...</b>` as plain text instead of parsing them:

```text
validate-icu "../**/en.json" --ignoreTag
```

Tag errors such as `UNCLOSED_TAG` are skipped; every other ICU error is still reported.

### Apostrophe-escaped placeholders

A single apostrophe directly before a placeholder escapes it: `l'{count}` renders the literal text `{count}` and the variable never substitutes. The CLI reports it as `APOSTROPHE_ESCAPES_PLACEHOLDER`. Double the apostrophe to display a real one and keep the placeholder alive: `l''{count}`.

## Error

```text
{
  errors: [
    {
      message: 'EXPECT_ARGUMENT_CLOSING_BRACE',
      value: '{count, plural, =0 {Minute} =1 {Minute} other {Minutes',
      key: 'units.minutes.label',
      filePath: 'src/__tests__/locales/en.json'
    },
    {
      message: 'MISSING_DEFAULT_EXPORT: the module has no default export',
      value: '',
      key: '',
      filePath: 'src/__tests__/locales/en-1.js'
    },
    {
      message: "APOSTROPHE_ESCAPES_PLACEHOLDER: double the apostrophe ('') to display a literal one, or remove it to keep the placeholder",
      value: "l'{count} articles sélectionnés",
      key: 'articles.selected',
      filePath: 'src/__tests__/locales/fr-apostrophe.ts'
    }
  ]
}
```
