import { base, ignorePatterns, react, vitest } from '@scaleway/oxlint-config'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [base, react, vitest],
  ignorePatterns,
  // All of the custom rules below should be removed
  overrides: [
    {
      files: ['**/*.{test,spec}.{ts,tsx,js,jsx}', '**/__tests__/**/*.{ts,tsx,js,jsx}'],
      plugins: ['vitest'],
      rules: {
        'vitest/no-conditional-expect': 'warn',
        'vitest/no-conditional-in-test': 'warn',
        'vitest/no-mocks-import': 'warn',
        'vitest/prefer-expect-type-of': 'warn',
        'vitest/prefer-import-in-mock': 'warn',
        'vitest/prefer-spy-on': 'warn',
        'vitest/prefer-strict-equal': 'warn',
        'vitest/require-mock-type-parameters': 'warn',
      },
    },
  ],
  rules: {
    'eslint/init-declarations': 'warn',
    'eslint/max-depth': 'warn',
    'eslint/max-params': 'warn',
    'eslint/no-await-in-loop': 'warn',
    'eslint/no-console': 'warn',
    'eslint/no-implicit-coercion': 'warn',
    'eslint/no-throw-literal': 'warn',
    'eslint/prefer-destructuring': 'warn',
    'eslint/prefer-named-capture-group': 'warn',
    'eslint/require-unicode-regexp': 'warn',

    'import/no-nodejs-modules': 'warn',
    'import/no-unassigned-import': 'warn',

    'node/no-process-env': 'warn',

    'oxc/no-accumulating-spread': 'warn',

    'react/no-multi-comp': 'warn',

    'typescript/consistent-indexed-object-style': 'warn',
    'typescript/explicit-member-accessibility': 'warn',
    'typescript/method-signature-style': 'warn',
    'typescript/no-confusing-void-expression': 'warn',
    'typescript/no-dynamic-delete': 'warn',
    'typescript/no-explicit-any': 'warn',
    'typescript/no-floating-promises': 'warn',
    'typescript/no-misused-promises': 'warn',
    'typescript/no-non-null-assertion': 'warn',
    'typescript/no-unnecessary-condition': 'warn',
    'typescript/no-unnecessary-type-assertion': 'warn',
    'typescript/no-unnecessary-type-parameters': 'warn',
    'typescript/no-unsafe-argument': 'warn',
    'typescript/no-unsafe-type-assertion': 'warn',
    'typescript/no-useless-default-assignment': 'warn',
    'typescript/only-throw-error': 'warn',
    'typescript/promise-function-async': 'warn',
    'typescript/require-await': 'warn',
    'typescript/strict-boolean-expressions': 'warn',
    'typescript/strict-void-return': 'warn',

    'unicorn/consistent-function-scoping': 'warn',
    'unicorn/max-nested-calls': 'warn',
    'unicorn/no-await-expression-member': 'warn',
    'unicorn/no-document-cookie': 'warn',
    'unicorn/no-object-as-default-parameter': 'warn',
    'unicorn/prefer-global-this': 'warn',
    'unicorn/prefer-object-from-entries': 'warn',
    'unicorn/prefer-string-replace-all': 'warn',
  },
})
