// oxlint-disable max-lines
import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['unicorn'],
  rules: {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/catch-error-name
     */
    'unicorn/catch-error-name': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-assert
     */
    'unicorn/consistent-assert': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-date-clone
     */
    'unicorn/consistent-date-clone': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-empty-array-spread
     */
    'unicorn/consistent-empty-array-spread': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-existence-index-check
     */
    'unicorn/consistent-existence-index-check': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-function-scoping
     */
    'unicorn/consistent-function-scoping': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-template-literal-escape
     */
    'unicorn/consistent-template-literal-escape': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/custom-error-definition
     */
    'unicorn/custom-error-definition': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/empty-brace-spaces
     */
    'unicorn/empty-brace-spaces': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/error-message
     */
    'unicorn/error-message': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/escape-case
     */
    'unicorn/escape-case': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/explicit-length-check
     */
    'unicorn/explicit-length-check': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/explicit-timer-delay
     */
    'unicorn/explicit-timer-delay': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/filename-case
     */
    'unicorn/filename-case': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/import-style
     */
    'unicorn/import-style': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/max-nested-calls
     */
    'unicorn/max-nested-calls': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/new-for-builtins
     */
    'unicorn/new-for-builtins': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-abusive-eslint-disable
     */
    'unicorn/no-abusive-eslint-disable': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-accessor-recursion
     */
    'unicorn/no-accessor-recursion': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-anonymous-default-export
     */
    'unicorn/no-anonymous-default-export': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-callback-reference
     */
    'unicorn/no-array-callback-reference': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-fill-with-reference-type
     */
    'unicorn/no-array-fill-with-reference-type': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-for-each
     */
    'unicorn/no-array-for-each': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-method-this-argument
     */
    'unicorn/no-array-method-this-argument': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-reduce
     */
    'unicorn/no-array-reduce': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-reverse
     */
    'unicorn/no-array-reverse': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-sort
     */
    'unicorn/no-array-sort': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-await-expression-member
     */
    'unicorn/no-await-expression-member': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-await-in-promise-methods
     */
    'unicorn/no-await-in-promise-methods': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-confusing-array-with
     */
    'unicorn/no-confusing-array-with': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-console-spaces
     */
    'unicorn/no-console-spaces': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-document-cookie
     */
    'unicorn/no-document-cookie': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-empty-file
     */
    'unicorn/no-empty-file': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-hex-escape
     */
    'unicorn/no-hex-escape': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-immediate-mutation
     */
    'unicorn/no-immediate-mutation': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-instanceof-array
     */
    'unicorn/no-instanceof-array': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-instanceof-builtins
     */
    'unicorn/no-instanceof-builtins': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-invalid-fetch-options
     */
    'unicorn/no-invalid-fetch-options': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-invalid-remove-event-listener
     */
    'unicorn/no-invalid-remove-event-listener': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-length-as-slice-end
     */
    'unicorn/no-length-as-slice-end': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-lonely-if
     */
    'unicorn/no-lonely-if': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-magic-array-flat-depth
     */
    'unicorn/no-magic-array-flat-depth': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-negated-condition
     */
    'unicorn/no-negated-condition': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-negation-in-equality-check
     */
    'unicorn/no-negation-in-equality-check': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-nested-ternary
     */
    'unicorn/no-nested-ternary': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-new-array
     */
    'unicorn/no-new-array': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-new-buffer
     */
    'unicorn/no-new-buffer': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-null
     */
    'unicorn/no-null': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-object-as-default-parameter
     */
    'unicorn/no-object-as-default-parameter': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-process-exit
     */
    'unicorn/no-process-exit': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-single-promise-in-promise-methods
     */
    'unicorn/no-single-promise-in-promise-methods': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-static-only-class
     */
    'unicorn/no-static-only-class': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-thenable
     */
    'unicorn/no-thenable': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-this-assignment
     */
    'unicorn/no-this-assignment': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-typeof-undefined
     */
    'unicorn/no-typeof-undefined': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unnecessary-array-flat-depth
     */
    'unicorn/no-unnecessary-array-flat-depth': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unnecessary-array-splice-count
     */
    'unicorn/no-unnecessary-array-splice-count': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unnecessary-await
     */
    'unicorn/no-unnecessary-await': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unnecessary-slice-end
     */
    'unicorn/no-unnecessary-slice-end': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unreadable-array-destructuring
     */
    'unicorn/no-unreadable-array-destructuring': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-unreadable-iife
     */
    'unicorn/no-unreadable-iife': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-collection-argument
     */
    'unicorn/no-useless-collection-argument': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-error-capture-stack-trace
     */
    'unicorn/no-useless-error-capture-stack-trace': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-fallback-in-spread
     */
    'unicorn/no-useless-fallback-in-spread': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-iterator-to-array
     */
    'unicorn/no-useless-iterator-to-array': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-length-check
     */
    'unicorn/no-useless-length-check': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-promise-resolve-reject
     */
    'unicorn/no-useless-promise-resolve-reject': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-spread
     */
    'unicorn/no-useless-spread': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-switch-case
     */
    'unicorn/no-useless-switch-case': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-undefined
     * @todo Needs to be reviewed
     */
    'unicorn/no-useless-undefined': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-zero-fractions
     */
    'unicorn/no-zero-fractions': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/number-literal-case
     */
    'unicorn/number-literal-case': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/numeric-separators-style
     */
    'unicorn/numeric-separators-style': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-add-event-listener
     */
    'unicorn/prefer-add-event-listener': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-array-find
     */
    'unicorn/prefer-array-find': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-array-flat
     */
    'unicorn/prefer-array-flat': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-array-flat-map
     */
    'unicorn/prefer-array-flat-map': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-array-index-of
     */
    'unicorn/prefer-array-index-of': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-array-some
     */
    'unicorn/prefer-array-some': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-at
     */
    'unicorn/prefer-at': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-bigint-literals
     */
    'unicorn/prefer-bigint-literals': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-blob-reading-methods
     */
    'unicorn/prefer-blob-reading-methods': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-class-fields
     */
    'unicorn/prefer-class-fields': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-classlist-toggle
     */
    'unicorn/prefer-classlist-toggle': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-code-point
     */
    'unicorn/prefer-code-point': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-date-now
     */
    'unicorn/prefer-date-now': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-default-parameters
     */
    'unicorn/prefer-default-parameters': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-dom-node-append
     */
    'unicorn/prefer-dom-node-append': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-dom-node-dataset
     */
    'unicorn/prefer-dom-node-dataset': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-dom-node-remove
     */
    'unicorn/prefer-dom-node-remove': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-dom-node-text-content
     */
    'unicorn/prefer-dom-node-text-content': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-event-target
     */
    'unicorn/prefer-event-target': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-export-from
     */
    'unicorn/prefer-export-from': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-global-this
     */
    'unicorn/prefer-global-this': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-import-meta-properties
     */
    'unicorn/prefer-import-meta-properties': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-includes
     */
    'unicorn/prefer-includes': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-keyboard-event-key
     */
    'unicorn/prefer-keyboard-event-key': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-logical-operator-over-ternary
     */
    'unicorn/prefer-logical-operator-over-ternary': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-math-min-max
     */
    'unicorn/prefer-math-min-max': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-math-trunc
     */
    'unicorn/prefer-math-trunc': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-modern-dom-apis
     */
    'unicorn/prefer-modern-dom-apis': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-modern-math-apis
     */
    'unicorn/prefer-modern-math-apis': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-module
     */
    'unicorn/prefer-module': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-native-coercion-functions
     */
    'unicorn/prefer-native-coercion-functions': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-negative-index
     */
    'unicorn/prefer-negative-index': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-node-protocol
     */
    'unicorn/prefer-node-protocol': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-number-coercion
     */
    'unicorn/prefer-number-coercion': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-number-properties
     */
    'unicorn/prefer-number-properties': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-object-from-entries
     */
    'unicorn/prefer-object-from-entries': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-optional-catch-binding
     */
    'unicorn/prefer-optional-catch-binding': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-prototype-methods
     */
    'unicorn/prefer-prototype-methods': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-query-selector
     */
    'unicorn/prefer-query-selector': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-reflect-apply
     */
    'unicorn/prefer-reflect-apply': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-regexp-test
     */
    'unicorn/prefer-regexp-test': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-response-static-json
     */
    'unicorn/prefer-response-static-json': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-set-has
     */
    'unicorn/prefer-set-has': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-set-size
     */
    'unicorn/prefer-set-size': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-single-call
     */
    'unicorn/prefer-single-call': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-spread
     */
    'unicorn/prefer-spread': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-string-raw
     */
    'unicorn/prefer-string-raw': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-string-replace-all
     */
    'unicorn/prefer-string-replace-all': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-string-slice
     */
    'unicorn/prefer-string-slice': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-string-starts-ends-with
     */
    'unicorn/prefer-string-starts-ends-with': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-string-trim-start-end
     */
    'unicorn/prefer-string-trim-start-end': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-structured-clone
     */
    'unicorn/prefer-structured-clone': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-ternary
     */
    'unicorn/prefer-ternary': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-top-level-await
     */
    'unicorn/prefer-top-level-await': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-type-error
     */
    'unicorn/prefer-type-error': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/relative-url-style
     */
    'unicorn/relative-url-style': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/require-array-join-separator
     */
    'unicorn/require-array-join-separator': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/require-module-attributes
     */
    'unicorn/require-module-attributes': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/require-module-specifiers
     */
    'unicorn/require-module-specifiers': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/require-number-to-fixed-digits-argument
     */
    'unicorn/require-number-to-fixed-digits-argument': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/require-post-message-target-origin
     */
    'unicorn/require-post-message-target-origin': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/switch-case-braces
     */
    'unicorn/switch-case-braces': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/switch-case-break-position
     */
    'unicorn/switch-case-break-position': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/text-encoding-identifier-case
     */
    'unicorn/text-encoding-identifier-case': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/unicorn/throw-new-error
     */
    'unicorn/throw-new-error': 'error',
  },
})
