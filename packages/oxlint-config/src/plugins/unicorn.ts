import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['unicorn'],
  rules: {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/catch-error-name
     * No consensus as of yet
     */
    'unicorn/catch-error-name': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-assert
     * No consensus as of yet
     */
    'unicorn/consistent-assert': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-date-clone
     * No consensus as of yet
     */
    'unicorn/consistent-date-clone': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-empty-array-spread
     * No consensus as of yet
     */
    'unicorn/consistent-empty-array-spread': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-existence-index-check
     * No consensus as of yet
     */
    'unicorn/consistent-existence-index-check': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-function-scoping
     * No consensus as of yet
     */
    'unicorn/consistent-function-scoping': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-template-literal-escape
     * No consensus as of yet
     */
    'unicorn/consistent-template-literal-escape': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/custom-error-definition
     * No consensus as of yet
     */
    'unicorn/custom-error-definition': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/empty-brace-spaces
     * No consensus as of yet
     */
    'unicorn/empty-brace-spaces': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/error-message
     * No consensus as of yet
     */
    'unicorn/error-message': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/escape-case
     * No consensus as of yet
     */
    'unicorn/escape-case': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/explicit-length-check
     * No consensus as of yet
     */
    'unicorn/explicit-length-check': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/explicit-timer-delay
     * No consensus as of yet
     */
    'unicorn/explicit-timer-delay': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/filename-case
     * No consensus as of yet
     */
    'unicorn/filename-case': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/import-style
     * No consensus as of yet
     */
    'unicorn/import-style': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/max-nested-calls
     * No consensus as of yet
     */
    'unicorn/max-nested-calls': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/new-for-builtins
     * No consensus as of yet
     */
    'unicorn/new-for-builtins': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-abusive-eslint-disable
     * No consensus as of yet
     */
    'unicorn/no-abusive-eslint-disable': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-accessor-recursion
     * No consensus as of yet
     */
    'unicorn/no-accessor-recursion': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-anonymous-default-export
     * No consensus as of yet
     */
    'unicorn/no-anonymous-default-export': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-callback-reference
     * No consensus as of yet
     */
    'unicorn/no-array-callback-reference': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-fill-with-reference-type
     * No consensus as of yet
     */
    'unicorn/no-array-fill-with-reference-type': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-for-each
     * No consensus as of yet
     */
    'unicorn/no-array-for-each': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-method-this-argument
     * No consensus as of yet
     */
    'unicorn/no-array-method-this-argument': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-reduce
     * No consensus as of yet
     */
    'unicorn/no-array-reduce': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-reverse
     * No consensus as of yet
     */
    'unicorn/no-array-reverse': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-sort
     * No consensus as of yet
     */
    'unicorn/no-array-sort': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-await-expression-member
     * No consensus as of yet
     */
    'unicorn/no-await-expression-member': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-await-in-promise-methods
     * No consensus as of yet
     */
    'unicorn/no-await-in-promise-methods': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-confusing-array-with
     * No consensus as of yet
     */
    'unicorn/no-confusing-array-with': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-console-spaces
     * No consensus as of yet
     */
    'unicorn/no-console-spaces': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-document-cookie
     * No consensus as of yet
     */
    'unicorn/no-document-cookie': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-empty-file
     * No consensus as of yet
     */
    'unicorn/no-empty-file': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-hex-escape
     * No consensus as of yet
     */
    'unicorn/no-hex-escape': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-immediate-mutation
     * No consensus as of yet
     */
    'unicorn/no-immediate-mutation': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-instanceof-array
     * No consensus as of yet
     */
    'unicorn/no-instanceof-array': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-instanceof-builtins
     * No consensus as of yet
     */
    'unicorn/no-instanceof-builtins': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-invalid-fetch-options
     * No consensus as of yet
     */
    'unicorn/no-invalid-fetch-options': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-invalid-remove-event-listener
     * No consensus as of yet
     */
    'unicorn/no-invalid-remove-event-listener': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-length-as-slice-end
     * No consensus as of yet
     */
    'unicorn/no-length-as-slice-end': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-lonely-if
     * No consensus as of yet
     */
    'unicorn/no-lonely-if': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-magic-array-flat-depth
     * No consensus as of yet
     */
    'unicorn/no-magic-array-flat-depth': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-negated-condition
     * No consensus as of yet
     */
    'unicorn/no-negated-condition': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-negation-in-equality-check
     * No consensus as of yet
     */
    'unicorn/no-negation-in-equality-check': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-nested-ternary
     * No consensus as of yet
     */
    'unicorn/no-nested-ternary': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-new-array
     * No consensus as of yet
     */
    'unicorn/no-new-array': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-new-buffer
     * No consensus as of yet
     */
    'unicorn/no-new-buffer': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-null
     * No consensus as of yet
     */
    'unicorn/no-null': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-object-as-default-parameter
     * No consensus as of yet
     */
    'unicorn/no-object-as-default-parameter': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-process-exit
     * No consensus as of yet
     */
    'unicorn/no-process-exit': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-single-promise-in-promise-methods
     * No consensus as of yet
     */
    'unicorn/no-single-promise-in-promise-methods': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-static-only-class
     * No consensus as of yet
     */
    'unicorn/no-static-only-class': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-thenable
     * No consensus as of yet
     */
    'unicorn/no-thenable': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-this-assignment
     * No consensus as of yet
     */
    'unicorn/no-this-assignment': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-typeof-undefined
     * No consensus as of yet
     */
    'unicorn/no-typeof-undefined': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unnecessary-array-flat-depth
     * No consensus as of yet
     */
    'unicorn/no-unnecessary-array-flat-depth': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unnecessary-array-splice-count
     * No consensus as of yet
     */
    'unicorn/no-unnecessary-array-splice-count': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unnecessary-await
     * No consensus as of yet
     */
    'unicorn/no-unnecessary-await': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unnecessary-slice-end
     * No consensus as of yet
     */
    'unicorn/no-unnecessary-slice-end': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unreadable-array-destructuring
     * No consensus as of yet
     */
    'unicorn/no-unreadable-array-destructuring': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unreadable-iife
     * No consensus as of yet
     */
    'unicorn/no-unreadable-iife': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-collection-argument
     * No consensus as of yet
     */
    'unicorn/no-useless-collection-argument': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-error-capture-stack-trace
     * No consensus as of yet
     */
    'unicorn/no-useless-error-capture-stack-trace': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-fallback-in-spread
     * No consensus as of yet
     */
    'unicorn/no-useless-fallback-in-spread': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-iterator-to-array
     * No consensus as of yet
     */
    'unicorn/no-useless-iterator-to-array': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-length-check
     * No consensus as of yet
     */
    'unicorn/no-useless-length-check': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-promise-resolve-reject
     * No consensus as of yet
     */
    'unicorn/no-useless-promise-resolve-reject': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-spread
     * No consensus as of yet
     */
    'unicorn/no-useless-spread': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-switch-case
     * No consensus as of yet
     */
    'unicorn/no-useless-switch-case': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-undefined
     * No consensus as of yet
     */
    'unicorn/no-useless-undefined': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-zero-fractions
     * No consensus as of yet
     */
    'unicorn/no-zero-fractions': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/number-literal-case
     * No consensus as of yet
     */
    'unicorn/number-literal-case': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/numeric-separators-style
     * No consensus as of yet
     */
    'unicorn/numeric-separators-style': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-add-event-listener
     * No consensus as of yet
     */
    'unicorn/prefer-add-event-listener': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-array-find
     * No consensus as of yet
     */
    'unicorn/prefer-array-find': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-array-flat
     * No consensus as of yet
     */
    'unicorn/prefer-array-flat': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-array-flat-map
     * No consensus as of yet
     */
    'unicorn/prefer-array-flat-map': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-array-index-of
     * No consensus as of yet
     */
    'unicorn/prefer-array-index-of': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-array-some
     * No consensus as of yet
     */
    'unicorn/prefer-array-some': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-at
     * No consensus as of yet
     */
    'unicorn/prefer-at': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-bigint-literals
     * No consensus as of yet
     */
    'unicorn/prefer-bigint-literals': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-blob-reading-methods
     * No consensus as of yet
     */
    'unicorn/prefer-blob-reading-methods': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-class-fields
     * No consensus as of yet
     */
    'unicorn/prefer-class-fields': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-classlist-toggle
     * No consensus as of yet
     */
    'unicorn/prefer-classlist-toggle': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-code-point
     * No consensus as of yet
     */
    'unicorn/prefer-code-point': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-date-now
     * No consensus as of yet
     */
    'unicorn/prefer-date-now': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-default-parameters
     * No consensus as of yet
     */
    'unicorn/prefer-default-parameters': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-dom-node-append
     * No consensus as of yet
     */
    'unicorn/prefer-dom-node-append': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-dom-node-dataset
     * No consensus as of yet
     */
    'unicorn/prefer-dom-node-dataset': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-dom-node-remove
     * No consensus as of yet
     */
    'unicorn/prefer-dom-node-remove': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-dom-node-text-content
     * No consensus as of yet
     */
    'unicorn/prefer-dom-node-text-content': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-event-target
     * No consensus as of yet
     */
    'unicorn/prefer-event-target': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-export-from
     * No consensus as of yet
     */
    'unicorn/prefer-export-from': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-global-this
     * No consensus as of yet
     */
    'unicorn/prefer-global-this': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-import-meta-properties
     * No consensus as of yet
     */
    'unicorn/prefer-import-meta-properties': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-includes
     * No consensus as of yet
     */
    'unicorn/prefer-includes': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-keyboard-event-key
     * No consensus as of yet
     */
    'unicorn/prefer-keyboard-event-key': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-logical-operator-over-ternary
     * No consensus as of yet
     */
    'unicorn/prefer-logical-operator-over-ternary': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-math-min-max
     * No consensus as of yet
     */
    'unicorn/prefer-math-min-max': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-math-trunc
     * No consensus as of yet
     */
    'unicorn/prefer-math-trunc': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-modern-dom-apis
     * No consensus as of yet
     */
    'unicorn/prefer-modern-dom-apis': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-modern-math-apis
     * No consensus as of yet
     */
    'unicorn/prefer-modern-math-apis': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-module
     * No consensus as of yet
     */
    'unicorn/prefer-module': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-native-coercion-functions
     * No consensus as of yet
     */
    'unicorn/prefer-native-coercion-functions': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-negative-index
     * No consensus as of yet
     */
    'unicorn/prefer-negative-index': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-node-protocol
     * No consensus as of yet
     */
    'unicorn/prefer-node-protocol': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-number-coercion
     * No consensus as of yet
     */
    'unicorn/prefer-number-coercion': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-number-properties
     * No consensus as of yet
     */
    'unicorn/prefer-number-properties': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-object-from-entries
     * No consensus as of yet
     */
    'unicorn/prefer-object-from-entries': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-optional-catch-binding
     * No consensus as of yet
     */
    'unicorn/prefer-optional-catch-binding': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-prototype-methods
     * No consensus as of yet
     */
    'unicorn/prefer-prototype-methods': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-query-selector
     * No consensus as of yet
     */
    'unicorn/prefer-query-selector': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-reflect-apply
     * No consensus as of yet
     */
    'unicorn/prefer-reflect-apply': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-regexp-test
     * No consensus as of yet
     */
    'unicorn/prefer-regexp-test': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-response-static-json
     * No consensus as of yet
     */
    'unicorn/prefer-response-static-json': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-set-has
     * No consensus as of yet
     */
    'unicorn/prefer-set-has': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-set-size
     * No consensus as of yet
     */
    'unicorn/prefer-set-size': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-single-call
     * No consensus as of yet
     */
    'unicorn/prefer-single-call': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-spread
     * No consensus as of yet
     */
    'unicorn/prefer-spread': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-string-raw
     * No consensus as of yet
     */
    'unicorn/prefer-string-raw': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-string-replace-all
     * No consensus as of yet
     */
    'unicorn/prefer-string-replace-all': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-string-slice
     * No consensus as of yet
     */
    'unicorn/prefer-string-slice': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-string-starts-ends-with
     * No consensus as of yet
     */
    'unicorn/prefer-string-starts-ends-with': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-string-trim-start-end
     * No consensus as of yet
     */
    'unicorn/prefer-string-trim-start-end': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-structured-clone
     * No consensus as of yet
     */
    'unicorn/prefer-structured-clone': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-ternary
     * No consensus as of yet
     */
    'unicorn/prefer-ternary': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-top-level-await
     * No consensus as of yet
     */
    'unicorn/prefer-top-level-await': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-type-error
     * No consensus as of yet
     */
    'unicorn/prefer-type-error': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/relative-url-style
     * No consensus as of yet
     */
    'unicorn/relative-url-style': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/require-array-join-separator
     * No consensus as of yet
     */
    'unicorn/require-array-join-separator': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/require-module-attributes
     * No consensus as of yet
     */
    'unicorn/require-module-attributes': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/require-module-specifiers
     * No consensus as of yet
     */
    'unicorn/require-module-specifiers': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/require-number-to-fixed-digits-argument
     * No consensus as of yet
     */
    'unicorn/require-number-to-fixed-digits-argument': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/require-post-message-target-origin
     * No consensus as of yet
     */
    'unicorn/require-post-message-target-origin': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/switch-case-braces
     * No consensus as of yet
     */
    'unicorn/switch-case-braces': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/switch-case-break-position
     * No consensus as of yet
     */
    'unicorn/switch-case-break-position': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/text-encoding-identifier-case
     * No consensus as of yet
     */
    'unicorn/text-encoding-identifier-case': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/throw-new-error
     * No consensus as of yet
     */
    'unicorn/throw-new-error': 'off',
  },
})
