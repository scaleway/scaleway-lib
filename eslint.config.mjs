// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import babelParser from '@babel/eslint-parser'
import scw from '@scaleway/eslint-config-react/javascript'
import scwTypescript from '@scaleway/eslint-config-react/typescript'
import oxlint from 'eslint-plugin-oxlint'
import globals from 'globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const defaultRules = [
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/__typetests__/',
      '**/packages_deprecated/',
      '**/coverage/',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
      },

      parserOptions: {
        project: [
          'tsconfig.json',
          'packages/*/tsconfig.json',
          'tools/*/tsconfig.json',
        ],
        tsconfigRootDir: dirname,
      },
      sourceType: 'module',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [
            './tsconfig.json', // Root config
            './packages/**/tsconfig.json',
          ],
        },
      },
      react: {
        // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
        // Defaults to the "defaultVersion" setting and warns if missing, and to "detect" in the future
        defaultVersion: '19', // Default React version to use when the version you have installed cannot be detected.
        fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
        pragma: 'React', // Pragma to use, default to "React"
        version: 'detect', // React version. "detect" automatically picks the version you have installed.
        // If not provided, defaults to the latest React version.
      },
    },
  },
  ...scw.map(config => ({ ...config, files: ['**/*.js'] })),
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        configFile: './babel.config.json',
      },
    },
  },
  ...scwTypescript.map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      ...config.rules,
      'import/order': 'off',
      'sort-imports': 'off',
    },
  })),

  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      ecmaVersion: 5,

      parserOptions: {
        project: [
          'tsconfig.json',
          'packages/**/tsconfig.json',
          '!packages/utils/tsconfig.json',
        ],
        // projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      sourceType: 'script',
    },
  },
  ...scwTypescript.map(config => ({
    ...config,
    files: [
      'packages/changesets-renovate/**/*.ts{x,}',
      'packages/validate-icu-locales/**/*.ts{x,}',
      '**/__tests__/**/*.ts{x,}',
    ],

    languageOptions: {
      ecmaVersion: 5,

      parserOptions: {
        project: ['tsconfig.json', 'packages/**/tsconfig.json'],
      },
      sourceType: 'script',
    },

    rules: {
      ...config.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'import/order': 'off',
      'no-console': 'off',
    },
  })),

  {
    files: [
      '**/__tests__/**/*.ts{x,}',
      '**/vitest.setup.ts',
      '**/*.config.ts',
      '**/__mocks__/**/*.ts{x,}',
    ],

    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      'eslint/prefer-arrow-callback': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-relative-packages': 'off',
      'prefer-arrow-callback': 'off',
      'react/jsx-key': 'off',
    },
  },
  ...oxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
]

export default defaultRules
