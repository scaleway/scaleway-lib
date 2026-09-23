import { base, ignorePatterns, react, vitest } from '@scaleway/oxlint-config'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [base, react, vitest],
  ignorePatterns,
  overrides: [
    {
      // This override needs to be removed
      files: [
        'packages/scouter/**/*.{ts,tsx}',
        'packages/changesets-renovate/**/*.{ts,tsx}',
        'packages/use-i18n/**/*.{ts,tsx}',
        'packages/use-dataloader/**/*.{ts,tsx}',
        'packages/auth-scw/**/*.{ts,tsx}',
        'packages/use-storage/**/*.{ts,tsx}',
        'packages/use-analytics/**/*.{ts,tsx}',
        'packages/use-growthbook/**/*.{ts,tsx}',
        'packages/regex/**/*.{ts,tsx}',
        'packages/utils/**/*.{ts,tsx}',
        'packages/validate-icu-locales/**/*.{ts,tsx}',
      ],
      rules: {
        'react/exhaustive-effect-dependencies': 'warn',
        'react/globals': 'warn',
        'react/hook-use-state': ['warn', { allowDestructuredState: true }],
        'react/immutability': 'warn',
        'react/no-deriving-state-in-effects': 'warn',
        'react/only-export-components': 'warn',
        'react/purity': 'warn',
        'react/refs': 'warn',
        'react/set-state-in-effect': 'warn',

        'typescript/explicit-member-accessibility': 'warn',
        'typescript/no-confusing-void-expression': 'warn',
        'typescript/no-non-null-assertion': 'warn',
        'typescript/no-unsafe-argument': 'warn',
        'typescript/no-unsafe-type-assertion': 'warn',
        'typescript/strict-boolean-expressions': 'warn',

        'unicorn/no-document-cookie': 'warn',
      },
    },
    {
      // node only packages
      files: [
        'packages/changesets-renovate/**',
        'packages/sync-peer-deps/**',
        'packages/utils/**',
        'packages/validate-icu-locales/**',
        'packages/npm-trust/**',
      ],
      rules: {
        'eslint/no-console': 'off',
        'import/no-nodejs-modules': 'off',
      },
    },
  ],
})
