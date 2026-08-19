import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['oxc'],
  rules: {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/approx-constant
     * No consensus as of yet
     */
    'oxc/approx-constant': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-array-method-on-arguments
     * No consensus as of yet
     */
    'oxc/bad-array-method-on-arguments': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-bitwise-operator
     * No consensus as of yet
     */
    'oxc/bad-bitwise-operator': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-char-at-comparison
     * No consensus as of yet
     */
    'oxc/bad-char-at-comparison': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-comparison-sequence
     * No consensus as of yet
     */
    'oxc/bad-comparison-sequence': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-match-all-arg
     * No consensus as of yet
     */
    'oxc/bad-match-all-arg': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-min-max-func
     * No consensus as of yet
     */
    'oxc/bad-min-max-func': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-object-literal-comparison
     * No consensus as of yet
     */
    'oxc/bad-object-literal-comparison': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-replace-all-arg
     * No consensus as of yet
     */
    'oxc/bad-replace-all-arg': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/branches-sharing-code
     * No consensus as of yet
     */
    'oxc/branches-sharing-code': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/const-comparisons
     * No consensus as of yet
     */
    'oxc/const-comparisons': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/double-comparisons
     * No consensus as of yet
     */
    'oxc/double-comparisons': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/erasing-op
     * No consensus as of yet
     */
    'oxc/erasing-op': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/misrefactored-assign-op
     * No consensus as of yet
     */
    'oxc/misrefactored-assign-op': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/missing-throw
     * No consensus as of yet
     */
    'oxc/missing-throw': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-accumulating-spread
     * No consensus as of yet
     */
    'oxc/no-accumulating-spread': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-async-await
     * No consensus as of yet
     */
    'oxc/no-async-await': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-async-endpoint-handlers
     * No consensus as of yet
     */
    'oxc/no-async-endpoint-handlers': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-barrel-file
     * No consensus as of yet
     */
    'oxc/no-barrel-file': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-const-enum
     * No consensus as of yet
     */
    'oxc/no-const-enum': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-map-spread
     * No consensus as of yet
     */
    'oxc/no-map-spread': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-optional-chaining
     * No consensus as of yet
     */
    'oxc/no-optional-chaining': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-rest-spread-properties
     * No consensus as of yet
     */
    'oxc/no-rest-spread-properties': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-this-in-exported-function
     * No consensus as of yet
     */
    'oxc/no-this-in-exported-function': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/number-arg-out-of-range
     * No consensus as of yet
     */
    'oxc/number-arg-out-of-range': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/only-used-in-recursion
     * No consensus as of yet
     */
    'oxc/only-used-in-recursion': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/uninvoked-array-callback
     * No consensus as of yet
     */
    'oxc/uninvoked-array-callback': 'off',
  },
})
