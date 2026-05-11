---
"@scaleway/oxfmt-config": minor
---

Add default ignorePatterns including:
  - .changeset
  - pnpm-workspace.yaml
  - **/_generated
  - **/*.gen.*
  - **/.next
  - **/next-env.d.ts
  - **/.output
  - **/dist
  - **/build
  - **/out
  - **/.turbo
  - **/storybook-static
  - **/.cache
  - **/public/build
  - **/.vite
  - **/coverage
  - **/.nyc_output
  - **/*.auto.*
  - **/graphql-types.*
  - **/schema.d.ts
  - **/schema.graphql.d.ts
  - **/*.d.ts.map

Add mergeConfig function
