import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import stylisticJs from './stylistic.mjs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const compat = new FlatCompat({
  baseDirectory: dirname,
})

const defaultRules = [
  ...fixupConfigRules(
    compat.extends(
      'airbnb/hooks',
      'prettier',
      'plugin:eslint-comments/recommended',
      'plugin:react/jsx-runtime',
    ),
  ),
  ...stylisticJs,
  {
    rules: {
      curly: 'error',
      'dot-notation': 'off',
      'import/extensions': 'off',

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/.jest/**',
            '**/.storybook/**',
            'test/**',
            'tests/**',
            'spec/**',
            '**/__tests__/**',
            '**/__mocks__/**',
            '**/__stories__/**',
            'test.{js,jsx,ts,tsx}',
            'test-*.{js,jsx,ts,tsx}',
            '**/*{.,_}{test,spec}.{js,jsx,ts,tsx}',
            '**/jest.config.{js,ts,mjs,mts}',
            '**/jest.setup.{js,ts,mjs,mts}',
            '**/webpack.config.{js,ts,mjs,mts}',
            '**/webpack.config.*.{js,ts,mjs,mts}',
            '**/rollup.config.{js,ts,mjs,mts}',
            '**/rollup.config.*.{js,ts,mjs,mts}',
          ],

          optionalDependencies: false,
        },
      ],

      'import/order': [
        'error',
        {
          alphabetize: {
            caseInsensitive: false,
            order: 'asc',
          },

          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            // "type",
          ],
          'newlines-between': 'never',
        },
      ],

      'import/prefer-default-export': 'off',
      'no-constant-binary-expression': 'error',

      'no-restricted-syntax': [
        'error',
        {
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
          selector: 'ForInStatement',
        },
        {
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
          selector: 'LabeledStatement',
        },
        {
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
          selector: 'WithStatement',
        },
        {
          message: '`export *` is forbidden.',
          selector: 'ExportAllDeclaration',
        },
      ],
      'no-use-before-define': 'off',

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          next: 'return',
          prev: '*',
        },
      ],
      'prefer-object-has-own': 'error',

      'react/function-component-definition': 'off',
      'react/jsx-key': 'error',
      'react/no-adjacent-inline-elements': 'error',
      'react/no-object-type-as-default-prop': 'error',

      'react/sort-prop-types': [
        'error',
        {
          ignoreCase: true,
          requiredFirst: false,
          sortShapeProp: true,
        },
      ],
      'react/state-in-constructor': ['error', 'never'],
      'react/static-property-placement': ['error', 'static public field'],

      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
          memberSyntaxSortOrder: ['single', 'multiple', 'all', 'none'],
        },
      ],

      'sort-keys': 'off',
    },
  },
]

export default defaultRules
