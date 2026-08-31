import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['import'],
  rules: {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/consistent-type-specifier-style
     */
    'import/consistent-type-specifier-style': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/default
     */
    'import/default': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/export
     */
    'import/export': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/exports-last
     * @todo Needs to be reviewed
     */
    'import/exports-last': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/extensions
     */
    'import/extensions': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/first
     */
    'import/first': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/group-exports
     */
    'import/group-exports': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/max-dependencies
     */
    'import/max-dependencies': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/named
     */
    'import/named': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/namespace
     */
    'import/namespace': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/newline-after-import
     */
    'import/newline-after-import': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-absolute-path
     */
    'import/no-absolute-path': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-amd
     */
    'import/no-amd': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-anonymous-default-export
     */
    'import/no-anonymous-default-export': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-commonjs
     */
    'import/no-commonjs': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-cycle
     */
    'import/no-cycle': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-default-export
     */
    'import/no-default-export': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-duplicates
     */
    'import/no-duplicates': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-dynamic-require
     */
    'import/no-dynamic-require': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-empty-named-blocks
     */
    'import/no-empty-named-blocks': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-mutable-exports
     */
    'import/no-mutable-exports': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-named-as-default
     */
    'import/no-named-as-default': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-named-as-default-member
     */
    'import/no-named-as-default-member': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-named-default
     */
    'import/no-named-default': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-named-export
     */
    'import/no-named-export': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-namespace
     */
    'import/no-namespace': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-nodejs-modules
     */
    'import/no-nodejs-modules': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-relative-parent-imports
     */
    'import/no-relative-parent-imports': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-self-import
     */
    'import/no-self-import': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-unassigned-import
     */
    'import/no-unassigned-import': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/no-webpack-loader-syntax
     */
    'import/no-webpack-loader-syntax': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/prefer-default-export
     */
    'import/prefer-default-export': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/import/unambiguous
     */
    'import/unambiguous': 'error',
  },
})
