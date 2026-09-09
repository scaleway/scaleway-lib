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
        'vitest/no-mocks-import': 'warn',
        'vitest/prefer-expect-type-of': 'warn',
        'vitest/prefer-spy-on': 'warn',
        'vitest/prefer-strict-equal': 'warn',
      },
    },
  ],
  rules: {
    'eslint/max-depth': 'warn',
    'eslint/max-params': 'warn',
    'eslint/no-await-in-loop': 'warn',
    'eslint/no-console': 'warn',
    'eslint/prefer-destructuring': 'warn',
    'eslint/prefer-named-capture-group': 'warn',

    'import/no-nodejs-modules': 'warn',

    'node/no-process-env': 'warn',

    'oxc/no-accumulating-spread': 'warn',

    'react/exhaustive-effect-dependencies': 'warn',
    'react/globals': 'warn',
    'react/hook-use-state': ['warn', { allowDestructuredState: true }],
    'react/immutability': 'warn',
    'react/no-clone-element': 'warn',
    'react/no-deriving-state-in-effects': 'warn',
    'react/no-react-children': 'warn',
    'react/only-export-components': 'warn',
    'react/purity': 'warn',
    'react/refs': 'warn',
    'react/set-state-in-effect': 'warn',

    'typescript/explicit-member-accessibility': 'warn',
    'typescript/method-signature-style': 'warn',
    'typescript/no-confusing-void-expression': 'warn',
    'typescript/no-dynamic-delete': 'warn',
    'typescript/no-explicit-any': 'warn',
    'typescript/no-misused-promises': 'warn',
    'typescript/no-non-null-assertion': 'warn',
    'typescript/no-unnecessary-condition': 'warn',
    'typescript/no-unsafe-argument': 'warn',
    'typescript/no-unsafe-type-assertion': 'warn',
    'typescript/no-useless-default-assignment': 'warn',
    'typescript/promise-function-async': 'warn',
    'typescript/require-await': 'warn',
    'typescript/strict-boolean-expressions': 'warn',
    'typescript/strict-void-return': 'warn',

    'unicorn/consistent-function-scoping': 'warn',
    'unicorn/max-nested-calls': 'warn',
    'unicorn/no-await-expression-member': 'warn',
    'unicorn/no-document-cookie': 'warn',
    'unicorn/prefer-global-this': 'warn',
    'unicorn/prefer-object-from-entries': 'warn',
  },
})
