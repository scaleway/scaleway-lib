# Unused i18n

Simplifies managing and cleaning up unused translation keys in localization files

## Features

- Analyzes source files to identify used and unused translation keys.
- Supports multiple scoped translation functions.
- Can display or remove unused translation keys.
- Configurable through a JSON, CJS, or JS config file.

## Installation

You can install `unused-i18n` via npm:

```sh
npm install -g unused-i18n

or

npm install -D unused-i18n
```

## Configuration

Create a unused-i18n.config.json or unused-i18n.config.js file in the root of your project. Here's an example configuration:

```cjs
module.exports = {
  paths: [
    {
      srcPath: ['src/pages/products'],
      localPath: 'src/pages/products/locales',
    },
  ],
  localesExtensions: 'ts',
  localesNames: 'en',
  scopedNames: ['scopedT', 'scopedTOne'],
  ignorePaths: ['src/pages/products/ignoreThisFolder'],
  excludeKey: ['someKey'],
}
```

| Option              | Type             | Default | Required | Description                                                                  |
| ------------------- | ---------------- | ------- | -------- | ---------------------------------------------------------------------------- |
| `paths`             | Array of Objects | `[]`    | Yes      | An array of objects defining the source paths and local paths to be checked. |
| `paths.srcPath`     | Array of Strings | `[]`    | Yes      | Source paths to search for translations.                                     |
| `paths.localPath`   | Strings          | `""`    | Yes      | Path to the translation files.                                               |
| `localesExtensions` | String           | `js`    | No       | Extension of the locale files.                                               |
| `localesNames`      | String           | `en`    | No       | Name of the locale files without the extension.                              |
| `scopedNames`       | Array of Strings | `[]`    | No       | Names of the scoped translation functions used in your project.              |
| `ignorePaths`       | Array of Strings | `[]`    | No       | Paths to be ignored during the search.                                       |
| `excludeKey`        | Array of Strings | `[]`    | No       | Specific translation keys to be excluded from the removal process.           |

## Usage

### Using with Config File

To use unused-i18n with your config file, simply run:

```sh
npx unused-i18n display
```

### Using with Command Line Options

You can also specify the source and local paths directly in the command line:

##### Display Unused Translations

```sh
npx unused-i18n display --srcPath="src/folders/bla" --localPath="src/folders/bla/locales"
```

##### Remove Unused Translations

```sh
npx unused-i18n remove --srcPath="src/folders/bla" --localPath="src/folders/bla/locales"
```

## API

`processTranslations(paths, action)`
Processes translations based on the specified paths and action.

- paths: Array of objects containing srcPath and localPath.
- action: Action to perform, either 'display' or 'remove'.

## Development

### Building the Project

To build the project, run:

```sh
npm run build
```

#### Running Tests

To run the tests, use:

```sh
npm run test
```

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Lawndlwd/unused-i18n/blob/HEAD/LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or suggestions.

Acknowledgements

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling.
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript used in this project.
- [Vitest](https://vitest.dev/guide/cli) - Testing framework used in this project.
- [Commander](https://github.com/tj/commander.js#readme) - Node.js command-line interfaces.
