import babelParser from '@babel/eslint-parser'
import scw from '@scaleway/eslint-config-react/javascript'
import scwTypescript from '@scaleway/eslint-config-react/typescript'
import globals from 'globals'

export default [
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
    settings: {
      react: {
        pragma: 'React', // Pragma to use, default to "React"
        fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
        version: 'detect', // React version. "detect" automatically picks the version you have installed.
        // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
        // Defaults to the "defaultVersion" setting and warns if missing, and to "detect" in the future
        defaultVersion: '18', // Default React version to use when the version you have installed cannot be detected.
        // If not provided, defaults to the latest React version.
      },
      'import/resolver': {
        typescript: {
          project: [
            './tsconfig.json', // Root config
            './packages/**/tsconfig.json',
          ],
        },
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
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
    rules: {
      ...config.rules,
      "import/order":'off',
    },
    files: ['**/*.ts', '**/*.tsx'],
  })),

  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: ['tsconfig.json', 'packages/**/tsconfig.json'],
        // projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
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
      sourceType: 'script',

      parserOptions: {
        project: ['tsconfig.json', 'packages/**/tsconfig.json'],
      },
    },

    rules: {
      ...config.rules,
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
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
      'import/no-extraneous-dependencies': 'off',
      'react/jsx-key': 'off',
      'import/no-relative-packages': 'off',
    },
  },
]
