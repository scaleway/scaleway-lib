![scaleway](https://user-images.githubusercontent.com/14060273/115696039-96f9ae00-a362-11eb-8225-8daafc861e86.png)

![Codecov](https://img.shields.io/codecov/c/github/scaleway/scaleway-lib)
![GitHub closed issues](https://img.shields.io/github/issues-closed/scaleway/scaleway-lib)
![dependencies](https://david-dm.org/scaleway/scaleway-lib.svg)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/scaleway/scaleway-lib)

# scaleway-lib

scaleway-lib is a set of NPM packages used at Scaleway.

---

- [Available packages](#available-packages)
- [Development](#development)
  - [Locally](#locally)
  - [Link against another project (with `yalc`) => FAVORED](#link-against-another-project-with-yalc--favored)
  - [Link against another project (with `pnpm link`)](#link-against-another-project-with-pnpm-link)
  - [Linting](#linting)
  - [Unit Test](#unit-test)
- [Lerna](#lerna)
- [Notes](#notes)
  - [On build targets](#on-build-targets)
  - [On build outputs](#on-build-outputs)
  - [On commits](#on-commits)
  - [On git hooks](#on-git-hooks)
  - [On versioning](#on-versioning)
- [Contributing Guidelines](#contributing-guidelines)

---

## Available packages

- [`@scaleway/cookie-consent`](./packages/countries/README.md): React provider to handle website end user consent cookie storage based on segment integrations.

  ![npm](https://img.shields.io/npm/dm/@scaleway/cookie-consent)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/cookie-consent)
  ![npm](https://img.shields.io/npm/v/@scaleway/cookie-consent)

- [`@scaleway/countries`](./packages_deprecated/countries/README.md): ISO 3166/3166-2 coutries JSON database.

  ![npm](https://img.shields.io/npm/dm/@scaleway/countries)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/countries)
  ![npm](https://img.shields.io/npm/v/@scaleway/countries)

- [`@scaleway/eslint-config-react`](./packages/eslint-config-react/README.md): A shared eslint react opiniated configuration. Available in Javascript and Typescript.

  ![npm](https://img.shields.io/npm/dm/@scaleway/eslint-config-react)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/eslint-config-react)
  ![npm](https://img.shields.io/npm/v/@scaleway/eslint-config-react)

- [`@scaleway/random-name`](./packages/random-name/README.md): A tiny utility to generate random names.

  ![npm](https://img.shields.io/npm/dm/@scaleway/random-name)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/random-name)
  ![npm](https://img.shields.io/npm/v/@scaleway/random-name)

- [`@scaleway/use-dataloader`](./packages/use-dataloader/README.md):
  A tiny react hook to to handle api requests.

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-dataloader)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/use-dataloader)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-dataloader)

- [`@scaleway/use-query-params`](./packages/use-query-params/README.md):
  A tiny react hook to read and update URLs query parameters.

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-query-params)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/use-query-params)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-query-params)

- [`@scaleway/use-segment`](./packages/use-segment/README.md):
  A tiny hooks to handle segment events.

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-segment)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/use-segment)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-segment)

- [`@scaleway/use-growthbook`](./packages/use-growthbook/README.md):
  A tiny hook to handle Growthbook Feature flag and A/B test tool.

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-growthbook)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/use-growthbook)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-growthbook)

- [`@scaleway/use-gtm`](./packages/use-gtm/README.md):
  A tiny hook to handle gtm.

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-gtm)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/use-gtm)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-gtm)

- [`@scaleway/use-i18n`](./packages/use-i18n/README.md):
  A tiny hook to handle i18n.

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-i18n)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/use-i18n)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-i18n)

- [`@scaleway/regex`](./packages/regex/README.md): usefull regex named.

  ![npm](https://img.shields.io/npm/dm/@scaleway/regex)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/regex)
  ![npm](https://img.shields.io/npm/v/@scaleway/regex)

- [`@scaleway/fuzzy-search`](./packages/fuzzy-search/README.md): fuzzy search utility

  ![npm](https://img.shields.io/npm/dm/@scaleway/fuzzy-search)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/fuzzy-search)
  ![npm](https://img.shields.io/npm/v/@scaleway/fuzzy-search)

- [`@scaleway/jest-helpers`](./packages/jest-helpers/README.md): utilities jest functions.

  ![npm](https://img.shields.io/npm/dm/@scaleway/jest-helpers)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/jest-helpers)
  ![npm](https://img.shields.io/npm/v/@scaleway/jest-helpers)

- [`@scaleway/outdated-browser`](./packages/outdated-browser/README.md): A small web script to display outdated banne

  ![npm](https://img.shields.io/npm/dm/@scaleway/outdated-browser)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/outdated-browser)
  ![npm](https://img.shields.io/npm/v/@scaleway/outdated-browser)

- [`@scaleway/validate-icu-locales`](./packages/validate-icu-locales/README.md): A small cli to check ICU locales error

  ![npm](https://img.shields.io/npm/dm/@scaleway/validate-icu-locales)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/validate-icu-locales)
  ![npm](https://img.shields.io/npm/v/@scaleway/validate-icu-locales)

- [`@scaleway/use-storage`](./packages/use-storage/README.md): A React hook to interact with local/session storage in reactive way with the same API as setState

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-storage)
  ![npm bundle size](https://packagephobia.com/badge?p=@scaleway/use-storage)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-storage)

## Development

### Locally

```bash
$ git clone git@github.com:scaleway/scaleway-lib.git
$ cd scaleway-lib
$ pnpm install
$ # ... do your changes ...
$ pnpm run lint
$ pnpm run test
```

### Link against another project (with `yalc`) => FAVORED

> [`yalc`](https://github.com/whitecolor/yalc) is a tool aiming to simplify working with local npm packages by providing a different workflow than `npm/yarn/pnpm link`, hence avoiding most of their issues with module resolving.

```bash
$ pnpm install -g yalc # Make sure to have the yalc binary
```

```bash
$ cd scaleway-lib/packages/example_package
$ pnpm run build && yalc publish
$ # Now it's ready to install in your project
$ cd ../../../project-something
$ yalc add @scaleway/package-name
$ cd ../scaleway-lib/packages/example_package
$ # If you do some changes into your package
$ pnpm run build && yalc publish --push --sig # --push will automatically update the package on projects where it have been added, --sig updates the signature hash to trigger webpack update
```

> :warning: since [1.0.0.pre.51 (2021-04-23)](https://github.com/wclr/yalc/blob/master/CHANGELOG.md#100pre51-2021-04-23), `yalc publish` needs the `--sig` option to trigger webpack module actual update.

> :warning: `yalc` create a `yalc.lock` and updates the `package.json` in the target project. **Make sure to not commit these changes**

### Link against another project (with `pnpm link`)

```bash
$ cd packages/example_package && pnpm link
$ cd - && pnpm run build # rebuild the package
$ # Now it's ready to link into your project
$ cd ../project-something
$ pnpm link @scaleway/example_package
```

### Linting

```bash
$ pnpm run oxc
$ pnpm run oxc:fix
```

### Unit Test

```bash
$ pnpm run test # Will run all tests
$ pnpm run test --updateSnapshot # Will update all snapshots
$ pnpm run test:watch # Will watch tests and only rerun the one who are modified
$ pnpm run test:coverage # Will generate a coverage report
```

## Lerna

This project is managed with [Lerna](https://lerna.js.org). Lerna is a tool to manage multiple NPM packages inside the same repository.

Lerna also allows us to use [PNPM workspaces](https://pnpm.io/workspaces) to manage our dependencies. This implies a few things:

- devDependencies should be included in top package.json
- There should be no `node_modules` or `pnpm-lock.yml` in sub-packages
- There is a special syntax to manage sub-packages dependencies:

```bash
$ pnpm add -W -D new_dependency # Add a new devDependency to root project
$ cd packages/package_name && pnpm add new_dependency
$ cd packages/package_name && pnpm remove old_dependency
```

## Notes

### On build targets

We target by default Node@14 but you can add a browser output by adding a `browser` (you can find the spec [here](https://github.com/defunctzombie/package-browser-field-spec)) target to your `package.json`.

```js
  "browser": {
    "dist/module.js": "dist/module.browser.js"
  }
```

The browserlist we are currently using is available in the [rollup.config.mjs](./rollup.config.mjs)

> :warning: Bear in mind that we do not currently support different entrypoint per target as we don't have the use case

### On build outputs

We only output ESM modules. Please [read this](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

Compiled modules supports Node > 14, the last two versions of any browsers and any browsers with more than 1% of marketshare at the time of release.

### On commits

We enforce the [conventionnal commits](https://www.conventionalcommits.org) convention in order to infer package bump versions and generate changelog.

### On git hooks

We have a [husky](https://github.com/typicode/husky) hook on `pre-commit` and `pre-push` which will ensure the file you committed matches the configured formating (`eslint` + `prettier`)

We also have one on `commit-msg` which will ensure you commit message respects our commit convention

We strongly encourage you not to but you can skip these hooks by passing `--no-verify` to your `git` commands

### On versioning

We follow the [semver](http://semver.org/) semantic.

## Contributing Guidelines

- Ensure tests are still ok and code coverage have not decreased
- Follow linter rules ([tldr](#linting)).
- CI is enforced, you won't be able to merge unless pipeline is successful.
