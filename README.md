![scaleway](https://user-images.githubusercontent.com/14060273/115696039-96f9ae00-a362-11eb-8225-8daafc861e86.png)

# scaleway-lib

scaleway-lib is a set of NPM packages used at Scaleway.

---

- [Available packages](#available-packages)
- [Development](#development)
  - [Locally](#locally)
  - [Link against another project (with `yalc`) => FAVORED](#link-against-another-project-with-yalc--favored)
    - [Testing a package in a pnpm workspace](#testing-a-package-in-a-pnpm-workspace)
  - [Link against another project (with `pnpm link`)](#link-against-another-project-with-pnpm-link)
  - [Linting](#linting)
  - [Unit Test](#unit-test)
- [Notes](#notes)
  - [Tools](#tools)
  - [On build targets](#on-build-targets)
  - [On build outputs](#on-build-outputs)
  - [On commits](#on-commits)
- [Contributing Guidelines](#contributing-guidelines)

---

## Available packages

- [`@scaleway/changesets-renovate`](./packages/changesets-renovate/README.md): A tool to automatically create changeset on renovate branches

  ![npm](https://img.shields.io/npm/dm/@scaleway/changesets-renovate)
  ![npm](https://img.shields.io/npm/v/@scaleway/changesets-renovate)

- [`@scaleway/fuzzy-search`](./packages/fuzzy-search/README.md): fuzzy search utility

  ![npm](https://img.shields.io/npm/dm/@scaleway/fuzzy-search)
  ![npm](https://img.shields.io/npm/v/@scaleway/fuzzy-search)

- [`@scaleway/oxfmt-config`](./packages/oxfmt-config/README.md): An oxfmt opiniated configuration.

  ![npm](https://img.shields.io/npm/dm/@scaleway/oxfmt-config)
  ![npm](https://img.shields.io/npm/v/@scaleway/oxfmt-config)

- [`@scaleway/oxlint-config`](./packages/oxlint-config/README.md): An oxlint opiniated configuration.

  ![npm](https://img.shields.io/npm/dm/@scaleway/oxlint-config)
  ![npm](https://img.shields.io/npm/v/@scaleway/oxlint-config)

- [`@scaleway/random-name`](./packages/random-name/README.md): A tiny utility to generate random names.

  ![npm](https://img.shields.io/npm/dm/@scaleway/random-name)
  ![npm](https://img.shields.io/npm/v/@scaleway/random-name)

- [`@scaleway/regex`](./packages/regex/README.md): usefull regex named.

  ![npm](https://img.shields.io/npm/dm/@scaleway/regex)
  ![npm](https://img.shields.io/npm/v/@scaleway/regex)

- [`@scaleway/use-countdown`](./packages/use-countdown/README.md)

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-countdown)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-countdown)

- [`@scaleway/use-dataloader`](./packages/use-dataloader/README.md):
  A tiny react hook to to handle api requests.

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-dataloader)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-dataloader)

- [`@scaleway/use-growthbook`](./packages/use-growthbook/README.md):
  A tiny hook to handle Growthbook Feature flag and A/B test tool.

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-growthbook)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-growthbook)

- [`@scaleway/use-i18n`](./packages/use-i18n/README.md):
  A tiny hook to handle i18n.

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-i18n)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-i18n)

- [`@scaleway/use-interval`](./packages/use-interval/README.md):

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-interval)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-interval)

- [`@scaleway/scouter`](./packages/scouter/README.md):

  ![npm](https://img.shields.io/npm/dm/@scaleway/scouter)
  ![npm](https://img.shields.io/npm/v/@scaleway/scouter)

- [`@scaleway/use-storage`](./packages/use-storage/README.md): A React hook to interact with local/session storage in reactive way with the same API as setState

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-storage)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-storage)

- [`@scaleway/use-visual-persistence`](./packages/use-visual-persistence/README.md)

  ![npm](https://img.shields.io/npm/dm/@scaleway/use-visual-persistence)
  ![npm](https://img.shields.io/npm/v/@scaleway/use-visual-persistence)

- [`@scaleway/validate-icu-locales`](./packages/validate-icu-locales/README.md): A small cli to check ICU locales error

  ![npm](https://img.shields.io/npm/dm/@scaleway/validate-icu-locales)
  ![npm](https://img.shields.io/npm/v/@scaleway/validate-icu-locales)

## Development

### Locally

```bash
git clone git@github.com:scaleway/scaleway-lib.git
cd scaleway-lib
pnpm install
# ... do your changes ...
pnpm run lint
pnpm run test:unit
```

### Link against another project (with `yalc`) => FAVORED

> [`yalc`](https://github.com/whitecolor/yalc) is a tool aiming to simplify working with local npm packages by providing a different workflow than `npm/yarn/pnpm link`, hence avoiding most of their issues with module resolving.

```bash
pnpm install -g yalc # Make sure to have the yalc binary
```

```bash
cd scaleway-lib/packages/example_package
pnpm run build && yalc publish
# Now it's ready to install in your project
cd ../../../project-something
yalc add @scaleway/package-name
cd ../scaleway-lib/packages/example_package
# If you do some changes into your package
pnpm run build && yalc publish --push --sig # --push will automatically update the package on projects where it have been added, --sig updates the signature hash to trigger webpack update
```

> :warning: since [1.0.0.pre.51 (2021-04-23)](https://github.com/wclr/yalc/blob/master/CHANGELOG.md#100pre51-2021-04-23), `yalc publish` needs the `--sig` option to trigger webpack module actual update.

> :warning: `yalc` create a `yalc.lock` and updates the `package.json` in the target project. **Make sure to not commit these changes**

#### Testing a package in a pnpm workspace

If you need to test a package that is used in more than one project in a pnpm workspace, it can be tedious to add the package in all projects and you might still have issues with modules resolution.

In order to install your local package in all the projects of the monorepo, you can use the pnpm overrides feature:

- first install the package using yalc (`yalc add @scaleway/package`) at the root of the pnpm workspace
- then add a pnpm override to use the yalc version in the whole workspace

Example `package.json`:

```json
"dependencies": {
  "@scaleway/package": "file:.yalc/@scaleway/package", // <- added by yalc
}
"pnpm": {
  "overrides": {
    "@scaleway/package": "$@scaleway/package", // <- tell pnpm to use the version referenced in the dependencies
  }
}
```

### Link against another project (with `pnpm link`)

```bash
cd packages/example_package && pnpm link
cd - && pnpm run build # rebuild the package
# Now it's ready to link into your project
cd ../project-something
pnpm link @scaleway/example_package
```

### Linting

```bash
pnpm run lint
pnpm run lint:fix
```

### Unit Test

```bash
pnpm run test:unit # Will run all tests
pnpm run test:unit:coverage # Will generate a coverage report
```

## Notes

### Tools

This projects uses

- [turbo](https://github.com/vercel/turborepo) to manage our monorepo setup
- [tsdown](https://github.com/rolldown/tsdown) to compile and bundle our packages
- [oxlint & oxfmt](https://github.com/oxc-project/oxc) to lint and format files
- [vitest](https://github.com/vitest-dev/vitest) to test our packages

### On build targets

For platform neutral packages the target is `esnext` by default. And for Node cli packages target is node@24

### On build outputs

We only output ESM modules. Please [read this](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

### On commits

We don't enforce anything on the commit level but your PR title must respect the [conventionnal commits](https://www.conventionalcommits.org) convention

## Contributing Guidelines

- Ensure tests are still ok and code coverage have not decreased
- Follow linter rules ([tldr](#linting)).
- CI is enforced, you won't be able to merge unless pipeline is successful.
