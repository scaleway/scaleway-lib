import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['oxc'],
  rules: {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/approx-constant
     */
    'oxc/approx-constant': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-array-method-on-arguments
     */
    'oxc/bad-array-method-on-arguments': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-bitwise-operator
     */
    'oxc/bad-bitwise-operator': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-char-at-comparison
     */
    'oxc/bad-char-at-comparison': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-comparison-sequence
     */
    'oxc/bad-comparison-sequence': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-match-all-arg
     */
    'oxc/bad-match-all-arg': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-min-max-func
     */
    'oxc/bad-min-max-func': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-object-literal-comparison
     */
    'oxc/bad-object-literal-comparison': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-replace-all-arg
     */
    'oxc/bad-replace-all-arg': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/branches-sharing-code
     */
    'oxc/branches-sharing-code': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/const-comparisons
     */
    'oxc/const-comparisons': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/double-comparisons
     */
    'oxc/double-comparisons': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/erasing-op
     */
    'oxc/erasing-op': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/misrefactored-assign-op
     */
    'oxc/misrefactored-assign-op': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/missing-throw
     */
    'oxc/missing-throw': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-accumulating-spread
     */
    'oxc/no-accumulating-spread': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-async-await
     */
    'oxc/no-async-await': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-async-endpoint-handlers
     */
    'oxc/no-async-endpoint-handlers': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-barrel-file
     */
    'oxc/no-barrel-file': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-const-enum
     */
    'oxc/no-const-enum': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-map-spread
     */
    'oxc/no-map-spread': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-optional-chaining
     */
    'oxc/no-optional-chaining': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-rest-spread-properties
     */
    'oxc/no-rest-spread-properties': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-this-in-exported-function
     */
    'oxc/no-this-in-exported-function': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/number-arg-out-of-range
     */
    'oxc/number-arg-out-of-range': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/only-used-in-recursion
     */
    'oxc/only-used-in-recursion': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/oxc/uninvoked-array-callback
     */
    'oxc/uninvoked-array-callback': 'error',
  },
})
