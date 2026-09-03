import { defineConfig } from 'oxlint'

export default defineConfig({
  overrides: [
    {
      files: ['**/*.{test,spec}.{ts,tsx,js,jsx}', '**/__tests__/**/*.{ts,tsx,js,jsx}'],
      plugins: ['vitest'],
      rules: {
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/consistent-each-for
         */
        'vitest/consistent-each-for': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/consistent-test-filename
         */
        'vitest/consistent-test-filename': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/consistent-test-it
         */
        'vitest/consistent-test-it': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/consistent-vitest-vi
         */
        'vitest/consistent-vitest-vi': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/expect-expect
         */
        'vitest/expect-expect': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/hoisted-apis-on-top
         */
        'vitest/hoisted-apis-on-top': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/max-expects
         */
        'vitest/max-expects': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/max-nested-describe
         */
        'vitest/max-nested-describe': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-alias-methods
         */
        'vitest/no-alias-methods': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-commented-out-tests
         */
        'vitest/no-commented-out-tests': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-conditional-expect
         */
        'vitest/no-conditional-expect': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-conditional-in-test
         */
        'vitest/no-conditional-in-test': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-conditional-tests
         */
        'vitest/no-conditional-tests': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-disabled-tests
         */
        'vitest/no-disabled-tests': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-duplicate-hooks
         */
        'vitest/no-duplicate-hooks': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-focused-tests
         */
        'vitest/no-focused-tests': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-hooks
         * @todo No consensus as of yet
         */
        'vitest/no-hooks': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-identical-title
         */
        'vitest/no-identical-title': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-import-node-test
         */
        'vitest/no-import-node-test': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-importing-vitest-globals
         */
        'vitest/no-importing-vitest-globals': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-interpolation-in-snapshots
         */
        'vitest/no-interpolation-in-snapshots': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-large-snapshots
         */
        'vitest/no-large-snapshots': ['error', { maxSize: 100 }],
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-mocks-import
         */
        'vitest/no-mocks-import': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-restricted-matchers
         */
        'vitest/no-restricted-matchers': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-restricted-vi-methods
         */
        'vitest/no-restricted-vi-methods': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-standalone-expect
         */
        'vitest/no-standalone-expect': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-test-prefixes
         */
        'vitest/no-test-prefixes': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-test-return-statement
         */
        'vitest/no-test-return-statement': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-unneeded-async-expect-function
         */
        'vitest/no-unneeded-async-expect-function': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/padding-around-after-all-blocks
         */
        'vitest/padding-around-after-all-blocks': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/padding-around-test-blocks
         */
        'vitest/padding-around-test-blocks': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-called-exactly-once-with
         */
        'vitest/prefer-called-exactly-once-with': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-called-once
         */
        'vitest/prefer-called-once': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-called-times
         */
        'vitest/prefer-called-times': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-called-with
         */
        'vitest/prefer-called-with': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-comparison-matcher
         */
        'vitest/prefer-comparison-matcher': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-describe-function-title
         */
        'vitest/prefer-describe-function-title': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-each
         */
        'vitest/prefer-each': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-equality-matcher
         */
        'vitest/prefer-equality-matcher': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-expect-assertions
         */
        'vitest/prefer-expect-assertions': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-expect-resolves
         */
        'vitest/prefer-expect-resolves': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-expect-type-of
         */
        'vitest/prefer-expect-type-of': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-hooks-in-order
         */
        'vitest/prefer-hooks-in-order': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-hooks-on-top
         */
        'vitest/prefer-hooks-on-top': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-import-in-mock
         */
        'vitest/prefer-import-in-mock': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-importing-vitest-globals
         */
        'vitest/prefer-importing-vitest-globals': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-lowercase-title
         */
        'vitest/prefer-lowercase-title': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-mock-promise-shorthand
         */
        'vitest/prefer-mock-promise-shorthand': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-mock-return-shorthand
         */
        'vitest/prefer-mock-return-shorthand': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-snapshot-hint
         */
        'vitest/prefer-snapshot-hint': ['error', 'multi'],
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-spy-on
         */
        'vitest/prefer-spy-on': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-strict-boolean-matchers
         */
        'vitest/prefer-strict-boolean-matchers': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-strict-equal
         */
        'vitest/prefer-strict-equal': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-be
         */
        'vitest/prefer-to-be': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-be-falsy
         */
        'vitest/prefer-to-be-falsy': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-be-object
         */
        'vitest/prefer-to-be-object': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-be-truthy
         */
        'vitest/prefer-to-be-truthy': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-contain
         */
        'vitest/prefer-to-contain': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-have-been-called-times
         */
        'vitest/prefer-to-have-been-called-times': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-have-length
         */
        'vitest/prefer-to-have-length': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-todo
         */
        'vitest/prefer-todo': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-awaited-expect-poll
         */
        'vitest/require-awaited-expect-poll': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-hook
         */
        'vitest/require-hook': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-local-test-context-for-concurrent-snapshots
         */
        'vitest/require-local-test-context-for-concurrent-snapshots': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-mock-type-parameters
         */
        'vitest/require-mock-type-parameters': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-test-timeout
         */
        'vitest/require-test-timeout': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-to-throw-message
         */
        'vitest/require-to-throw-message': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-top-level-describe
         */
        'vitest/require-top-level-describe': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-describe-callback
         */
        'vitest/valid-describe-callback': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-expect
         */
        'vitest/valid-expect': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-expect-in-promise
         */
        'vitest/valid-expect-in-promise': 'error',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-title
         */
        'vitest/valid-title': ['error', { allowArguments: true }],
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/warn-todo
         */
        'vitest/warn-todo': 'off',
      },
    },
  ],
})
