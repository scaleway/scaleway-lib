import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['node'],
  rules: {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/node/callback-return
     */
    'node/callback-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/node/exports-style
     * No consensus as of yet
     */
    'node/exports-style': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/node/global-require
     */
    'node/global-require': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/node/handle-callback-err
     */
    'node/handle-callback-err': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/node/no-exports-assign
     */
    'node/no-exports-assign': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/node/no-mixed-requires
     * No consensus as of yet
     */
    'node/no-mixed-requires': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/node/no-new-require
     */
    'node/no-new-require': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/node/no-path-concat
     */
    'node/no-path-concat': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/node/no-process-env
     */
    'node/no-process-env': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/node/no-sync
     * No consensus as of yet
     */
    'node/no-sync': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/node/no-top-level-await
     * No consensus as of yet
     */
    'node/no-top-level-await': 'off',
  },
})
