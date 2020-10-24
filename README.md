# scaleway-lib

scaleway-lib is a set of NPM packgages used at Scaleway. These libraries are available on our [private NPM registry](https://***REMOVED***).

---

## Development

### Locally

```bash
$ git clone git@***REMOVED***/scaleway-lib.git
$ cd scaleway-lib
$ yarn
$ # ... do your changes ...
$ yarn run lint
$ yarn run test
```

### Link against another project

```bash
$ cd packages/example_package
$ yarn link
$ cd - && yarn run build # rebuild the package
$ cd ../fo-something
$ yarn link @scaleway/example_package
```

#### Linting

```bash
$ yarn run lint
$ yarn run lint:fix
```

#### Unit Test

```bash
$ yarn run test # Will run all tests
$ yarn run test --updateSnapshot # Will update all snapshots
$ yarn run test:watch # Will watch tests and only rerun the one who are modified
$ yarn run test:coverage # Will generate a coverage report
```

## Lerna

This project is managed with [Lerna](https://lerna.js.org). Lerna is a tool to manage multiple NPM packages inside the same repository.

Lerna also allows us to use [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to manage our dependencies. This implies a few things:

- devDependencies should be included in top package.json
- There should be no `node_modules` or `yarn.lock` in sub-packages
- There is a special syntax to manage sub-packages dependencies:

```bash
$ yarn add -W -D new_dependency # Add a new devDependency to root project
$ yarn workspace @scaleway/package_name add new_dependency
$ yarn workspace @scaleway/package_name remove old_dependency
```

### Notes

### On build targets

We target by default Node@14 but you can add a browser output by adding a `browser` (you can find the spec [here](https://github.com/defunctzombie/package-browser-field-spec)) target to your `package.json`.

```js
  "browser": {
    "dist/index.js": "dist/index.browser.js",
    "dist/module.js": "dist/module.browser.js"
  }
```

The browserlist we are currently using is available in the [rollup.config.js](./rollup.config.js)

Bear in mind that we do not currently support different entrypoint per target as we don't have the use case
{: .alert .alert-warning}

#### On build outputs

We output both UMD and ESM files for each target.

##### On commits

We enforce the [conventionnal commits](https://www.conventionalcommits.org) convention in order to infer package bump versions and generate changelog.

##### On versioning

We follow the [semver](http://semver.org/) semantic.

### Rules

- Follow linter rules.
- Ensure to have a tested code before merging.
