import { defineConfig } from 'oxlint'

export default defineConfig({
  overrides: [
    {
      files: ['**/*.{test,spec}.{ts,tsx,js,jsx}', '**/__tests__/**/*.{ts,tsx,js,jsx}'],
      plugins: ['vitest'],
      rules: {
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/consistent-each-for
         * No consensus as of yet
         */
        'vitest/consistent-each-for': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/consistent-test-filename
         * No consensus as of yet
         */
        'vitest/consistent-test-filename': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/consistent-test-it
         * No consensus as of yet
         */
        'vitest/consistent-test-it': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/consistent-vitest-vi
         * No consensus as of yet
         */
        'vitest/consistent-vitest-vi': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/expect-expect
         * No consensus as of yet
         */
        'vitest/expect-expect': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/hoisted-apis-on-top
         * No consensus as of yet
         */
        'vitest/hoisted-apis-on-top': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/max-expects
         * No consensus as of yet
         */
        'vitest/max-expects': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/max-nested-describe
         * No consensus as of yet
         */
        'vitest/max-nested-describe': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-alias-methods
         * No consensus as of yet
         */
        'vitest/no-alias-methods': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-commented-out-tests
         * No consensus as of yet
         */
        'vitest/no-commented-out-tests': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-conditional-expect
         * No consensus as of yet
         */
        'vitest/no-conditional-expect': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-conditional-in-test
         * No consensus as of yet
         */
        'vitest/no-conditional-in-test': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-conditional-tests
         * No consensus as of yet
         */
        'vitest/no-conditional-tests': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-disabled-tests
         * No consensus as of yet
         */
        'vitest/no-disabled-tests': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-duplicate-hooks
         * No consensus as of yet
         */
        'vitest/no-duplicate-hooks': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-focused-tests
         * No consensus as of yet
         */
        'vitest/no-focused-tests': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-hooks
         * No consensus as of yet
         */
        'vitest/no-hooks': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-identical-title
         * No consensus as of yet
         */
        'vitest/no-identical-title': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-import-node-test
         * No consensus as of yet
         */
        'vitest/no-import-node-test': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-importing-vitest-globals
         * No consensus as of yet
         */
        'vitest/no-importing-vitest-globals': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-interpolation-in-snapshots
         * No consensus as of yet
         */
        'vitest/no-interpolation-in-snapshots': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-large-snapshots
         * No consensus as of yet
         */
        'vitest/no-large-snapshots': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-mocks-import
         * No consensus as of yet
         */
        'vitest/no-mocks-import': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-restricted-matchers
         * No consensus as of yet
         */
        'vitest/no-restricted-matchers': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-restricted-vi-methods
         * No consensus as of yet
         */
        'vitest/no-restricted-vi-methods': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-standalone-expect
         * No consensus as of yet
         */
        'vitest/no-standalone-expect': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-test-prefixes
         * No consensus as of yet
         */
        'vitest/no-test-prefixes': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-test-return-statement
         * No consensus as of yet
         */
        'vitest/no-test-return-statement': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/no-unneeded-async-expect-function
         * No consensus as of yet
         */
        'vitest/no-unneeded-async-expect-function': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/padding-around-after-all-blocks
         * No consensus as of yet
         */
        'vitest/padding-around-after-all-blocks': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/padding-around-test-blocks
         * No consensus as of yet
         */
        'vitest/padding-around-test-blocks': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-called-exactly-once-with
         * No consensus as of yet
         */
        'vitest/prefer-called-exactly-once-with': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-called-once
         * No consensus as of yet
         */
        'vitest/prefer-called-once': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-called-times
         * No consensus as of yet
         */
        'vitest/prefer-called-times': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-called-with
         * No consensus as of yet
         */
        'vitest/prefer-called-with': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-comparison-matcher
         * No consensus as of yet
         */
        'vitest/prefer-comparison-matcher': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-describe-function-title
         * No consensus as of yet
         */
        'vitest/prefer-describe-function-title': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-each
         * No consensus as of yet
         */
        'vitest/prefer-each': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-equality-matcher
         * No consensus as of yet
         */
        'vitest/prefer-equality-matcher': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-expect-assertions
         * No consensus as of yet
         */
        'vitest/prefer-expect-assertions': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-expect-resolves
         * No consensus as of yet
         */
        'vitest/prefer-expect-resolves': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-expect-type-of
         * No consensus as of yet
         */
        'vitest/prefer-expect-type-of': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-hooks-in-order
         * No consensus as of yet
         */
        'vitest/prefer-hooks-in-order': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-hooks-on-top
         * No consensus as of yet
         */
        'vitest/prefer-hooks-on-top': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-import-in-mock
         * No consensus as of yet
         */
        'vitest/prefer-import-in-mock': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-importing-vitest-globals
         * No consensus as of yet
         */
        'vitest/prefer-importing-vitest-globals': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-lowercase-title
         * No consensus as of yet
         */
        'vitest/prefer-lowercase-title': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-mock-promise-shorthand
         * No consensus as of yet
         */
        'vitest/prefer-mock-promise-shorthand': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-mock-return-shorthand
         * No consensus as of yet
         */
        'vitest/prefer-mock-return-shorthand': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-snapshot-hint
         * No consensus as of yet
         */
        'vitest/prefer-snapshot-hint': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-spy-on
         * No consensus as of yet
         */
        'vitest/prefer-spy-on': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-strict-boolean-matchers
         * No consensus as of yet
         */
        'vitest/prefer-strict-boolean-matchers': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-strict-equal
         * No consensus as of yet
         */
        'vitest/prefer-strict-equal': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-be
         * No consensus as of yet
         */
        'vitest/prefer-to-be': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-be-falsy
         * No consensus as of yet
         */
        'vitest/prefer-to-be-falsy': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-be-object
         * No consensus as of yet
         */
        'vitest/prefer-to-be-object': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-be-truthy
         * No consensus as of yet
         */
        'vitest/prefer-to-be-truthy': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-contain
         * No consensus as of yet
         */
        'vitest/prefer-to-contain': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-have-been-called-times
         * No consensus as of yet
         */
        'vitest/prefer-to-have-been-called-times': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-have-length
         * No consensus as of yet
         */
        'vitest/prefer-to-have-length': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-todo
         * No consensus as of yet
         */
        'vitest/prefer-todo': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-awaited-expect-poll
         * No consensus as of yet
         */
        'vitest/require-awaited-expect-poll': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-hook
         * No consensus as of yet
         */
        'vitest/require-hook': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-local-test-context-for-concurrent-snapshots
         * No consensus as of yet
         */
        'vitest/require-local-test-context-for-concurrent-snapshots': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-mock-type-parameters
         * No consensus as of yet
         */
        'vitest/require-mock-type-parameters': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-test-timeout
         * No consensus as of yet
         */
        'vitest/require-test-timeout': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-to-throw-message
         * No consensus as of yet
         */
        'vitest/require-to-throw-message': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-top-level-describe
         * No consensus as of yet
         */
        'vitest/require-top-level-describe': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-describe-callback
         * No consensus as of yet
         */
        'vitest/valid-describe-callback': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-expect
         * No consensus as of yet
         */
        'vitest/valid-expect': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-expect-in-promise
         * No consensus as of yet
         */
        'vitest/valid-expect-in-promise': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/valid-title
         * No consensus as of yet
         */
        'vitest/valid-title': 'off',
        /**
         * @see https://oxc.rs/docs/guide/usage/linter/rules/vitest/warn-todo
         * No consensus as of yet
         */
        'vitest/warn-todo': 'off',
      },
    },
  ],
})
