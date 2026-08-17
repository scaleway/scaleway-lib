import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript'],
  rules: {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/adjacent-overload-signatures
     */
    'typescript/adjacent-overload-signatures': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/array-type
     */
    'typescript/array-type': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/await-thenable
     */
    'typescript/await-thenable': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/ban-ts-comment
     */
    'typescript/ban-ts-comment': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/ban-tslint-comment
     * @todo No consensus as of yet
     */
    'typescript/ban-tslint-comment': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/ban-types
     */
    'typescript/ban-types': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/class-literal-property-style
     */
    'typescript/class-literal-property-style': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-generic-constructors
     */
    'typescript/consistent-generic-constructors': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-indexed-object-style
     */
    'typescript/consistent-indexed-object-style': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-return
     */
    'typescript/consistent-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-type-assertions
     */
    'typescript/consistent-type-assertions': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-type-definitions
     */
    'typescript/consistent-type-definitions': ['error', 'type'],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-type-exports
     */
    'typescript/consistent-type-exports': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-type-imports
     */
    'typescript/consistent-type-imports': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/dot-notation
     */
    'typescript/dot-notation': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/explicit-function-return-type
     */
    'typescript/explicit-function-return-type': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/explicit-member-accessibility
     */
    'typescript/explicit-member-accessibility': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/explicit-module-boundary-types
     * @todo Needs to be reviewed
     */
    'typescript/explicit-module-boundary-types': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/method-signature-style
     */
    'typescript/method-signature-style': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-array-delete
     */
    'typescript/no-array-delete': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-base-to-string
     */
    'typescript/no-base-to-string': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-confusing-non-null-assertion
     */
    'typescript/no-confusing-non-null-assertion': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-confusing-void-expression
     */
    'typescript/no-confusing-void-expression': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-deprecated
     */
    'typescript/no-deprecated': 'warn',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-duplicate-enum-values
     */
    'typescript/no-duplicate-enum-values': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-duplicate-type-constituents
     */
    'typescript/no-duplicate-type-constituents': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-dynamic-delete
     */
    'typescript/no-dynamic-delete': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-empty-interface
     */
    'typescript/no-empty-interface': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-empty-object-type
     */
    'typescript/no-empty-object-type': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-explicit-any
     */
    'typescript/no-explicit-any': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-extra-non-null-assertion
     */
    'typescript/no-extra-non-null-assertion': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-extraneous-class
     */
    'typescript/no-extraneous-class': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-floating-promises
     */
    'typescript/no-floating-promises': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-for-in-array
     */
    'typescript/no-for-in-array': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-implied-eval
     */
    'typescript/no-implied-eval': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-import-type-side-effects
     */
    'typescript/no-import-type-side-effects': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-inferrable-types
     */
    'typescript/no-inferrable-types': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-invalid-void-type
     */
    'typescript/no-invalid-void-type': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-meaningless-void-operator
     */
    'typescript/no-meaningless-void-operator': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-misused-new
     */
    'typescript/no-misused-new': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-misused-promises
     */
    'typescript/no-misused-promises': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-misused-spread
     */
    'typescript/no-misused-spread': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-mixed-enums
     */
    'typescript/no-mixed-enums': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-namespace
     */
    'typescript/no-namespace': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-non-null-asserted-nullish-coalescing
     */
    'typescript/no-non-null-asserted-nullish-coalescing': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-non-null-asserted-optional-chain
     */
    'typescript/no-non-null-asserted-optional-chain': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-non-null-assertion
     */
    'typescript/no-non-null-assertion': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-redundant-type-constituents
     */
    'typescript/no-redundant-type-constituents': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-require-imports
     */
    'typescript/no-require-imports': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-restricted-types
     */
    'typescript/no-restricted-types': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-this-alias
     */
    'typescript/no-this-alias': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-boolean-literal-compare
     */
    'typescript/no-unnecessary-boolean-literal-compare': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-condition
     */
    'typescript/no-unnecessary-condition': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-parameter-property-assignment
     */
    'typescript/no-unnecessary-parameter-property-assignment': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-qualifier
     */
    'typescript/no-unnecessary-qualifier': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-template-expression
     */
    'typescript/no-unnecessary-template-expression': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-type-arguments
     */
    'typescript/no-unnecessary-type-arguments': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-type-assertion
     */
    'typescript/no-unnecessary-type-assertion': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-type-constraint
     */
    'typescript/no-unnecessary-type-constraint': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-type-conversion
     */
    'typescript/no-unnecessary-type-conversion': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-type-parameters
     */
    'typescript/no-unnecessary-type-parameters': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-argument
     */
    'typescript/no-unsafe-argument': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-assignment
     */
    'typescript/no-unsafe-assignment': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-call
     */
    'typescript/no-unsafe-call': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-declaration-merging
     */
    'typescript/no-unsafe-declaration-merging': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-enum-comparison
     */
    'typescript/no-unsafe-enum-comparison': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-function-type
     */
    'typescript/no-unsafe-function-type': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-member-access
     */
    'typescript/no-unsafe-member-access': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-return
     */
    'typescript/no-unsafe-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-type-assertion
     */
    'typescript/no-unsafe-type-assertion': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-unary-minus
     */
    'typescript/no-unsafe-unary-minus': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-useless-default-assignment
     */
    'typescript/no-useless-default-assignment': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-useless-empty-export
     */
    'typescript/no-useless-empty-export': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-var-requires
     */
    'typescript/no-var-requires': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-wrapper-object-types
     */
    'typescript/no-wrapper-object-types': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/non-nullable-type-assertion-style
     */
    'typescript/non-nullable-type-assertion-style': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/only-throw-error
     */
    'typescript/only-throw-error': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/parameter-properties
     */
    'typescript/parameter-properties': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-as-const
     */
    'typescript/prefer-as-const': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-enum-initializers
     */
    'typescript/prefer-enum-initializers': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-find
     */
    'typescript/prefer-find': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-for-of
     */
    'typescript/prefer-for-of': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-function-type
     */
    'typescript/prefer-function-type': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-includes
     */
    'typescript/prefer-includes': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-literal-enum-member
     */
    'typescript/prefer-literal-enum-member': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-namespace-keyword
     */
    'typescript/prefer-namespace-keyword': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-nullish-coalescing
     */
    'typescript/prefer-nullish-coalescing': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-optional-chain
     */
    'typescript/prefer-optional-chain': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-promise-reject-errors
     */
    'typescript/prefer-promise-reject-errors': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-readonly
     */
    'typescript/prefer-readonly': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-readonly-parameter-types
     * @todo Needs to be reviewed
     */
    'typescript/prefer-readonly-parameter-types': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-reduce-type-parameter
     */
    'typescript/prefer-reduce-type-parameter': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-regexp-exec
     */
    'typescript/prefer-regexp-exec': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-return-this-type
     */
    'typescript/prefer-return-this-type': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-string-starts-ends-with
     */
    'typescript/prefer-string-starts-ends-with': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-ts-expect-error
     */
    'typescript/prefer-ts-expect-error': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/promise-function-async
     */
    'typescript/promise-function-async': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/related-getter-setter-pairs
     */
    'typescript/related-getter-setter-pairs': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/require-array-sort-compare
     */
    'typescript/require-array-sort-compare': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/require-await
     */
    'typescript/require-await': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/restrict-plus-operands
     */
    'typescript/restrict-plus-operands': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/restrict-template-expressions
     */
    'typescript/restrict-template-expressions': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/return-await
     */
    'typescript/return-await': ['error', 'error-handling-correctness-only'],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/strict-boolean-expressions
     */
    'typescript/strict-boolean-expressions': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/strict-void-return
     */
    'typescript/strict-void-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/switch-exhaustiveness-check
     */
    'typescript/switch-exhaustiveness-check': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/triple-slash-reference
     */
    'typescript/triple-slash-reference': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/unbound-method
     */
    'typescript/unbound-method': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/unified-signatures
     */
    'typescript/unified-signatures': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/typescript/use-unknown-in-catch-callback-variable
     */
    'typescript/use-unknown-in-catch-callback-variable': 'error',
  },
})
