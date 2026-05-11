# @scaleway/oxfmt-config

## 1.1.0

### Minor Changes

- [#3266](https://github.com/scaleway/scaleway-lib/pull/3266) [`6326628`](https://github.com/scaleway/scaleway-lib/commit/6326628ff256a7df136e82fe0cda8ae0447d8bbe) Thanks [@chambo-e](https://github.com/chambo-e)! - Add default ignorePatterns including:

  - .changeset
  - pnpm-workspace.yaml
  - \*\*/\_generated
  - \*_/_.gen.\*
  - \*\*/.next
  - \*\*/next-env.d.ts
  - \*\*/.output
  - \*\*/dist
  - \*\*/build
  - \*\*/out
  - \*\*/.turbo
  - \*\*/storybook-static
  - \*\*/.cache
  - \*\*/public/build
  - \*\*/.vite
  - \*\*/coverage
  - \*\*/.nyc_output
  - \*_/_.auto.\*
  - \*_/graphql-types._
  - \*\*/schema.d.ts
  - \*\*/schema.graphql.d.ts
  - \*_/_.d.ts.map

  Add mergeConfig function

## 1.0.0

### Major Changes

- [#3263](https://github.com/scaleway/scaleway-lib/pull/3263) [`cb7be00`](https://github.com/scaleway/scaleway-lib/commit/cb7be00d36d161a61d3f0ffb2b14351f94346e6b) Thanks [@chambo-e](https://github.com/chambo-e)! - introduce @scaleway/oxfmt-config
