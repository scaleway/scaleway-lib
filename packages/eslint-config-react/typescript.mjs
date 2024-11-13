import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import deprecation from 'eslint-plugin-deprecation'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import shared from './shared.mjs'

/* eslint-disable import/no-extraneous-dependencies */
const {
  rules: baseBestPracticesRules,
} = require('eslint-config-airbnb-base/rules/best-practices')
const {
  rules: baseErrorsRules,
} = require('eslint-config-airbnb-base/rules/errors')
const { rules: baseES6Rules } = require('eslint-config-airbnb-base/rules/es6')
const {
  rules: baseImportsRules,
} = require('eslint-config-airbnb-base/rules/imports')
const {
  rules: baseStyleRules,
} = require('eslint-config-airbnb-base/rules/style')
const {
  rules: baseVariablesRules,
} = require('eslint-config-airbnb-base/rules/variables')
/* eslint-enable import/no-extraneous-dependencies */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const compat = new FlatCompat({
  baseDirectory: dirname,
})

export default [
  ...fixupConfigRules(
    compat.extends(
      'eslint-config-airbnb',
      // 'eslint-config-airbnb-typescript',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ),
  ),
  ...shared,
  {
    plugins: {
      deprecation,
    },

    rules: {
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array',
        },
      ],

      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      '@typescript-eslint/no-floating-promises': 'error',

      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      'react/require-default-props': 'off',
      'react/prop-types': 'off',

      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: true,
        },
      ],
      // Replace Airbnb 'brace-style' rule with '@typescript-eslint' version
      'brace-style': 'off',
      '@typescript-eslint/brace-style': baseStyleRules['brace-style'],

      // Replace Airbnb 'camelcase' rule with '@typescript-eslint/naming-convention'
      camelcase: 'off',
      // The `@typescript-eslint/naming-convention` rule allows `leadingUnderscore` and `trailingUnderscore` settings. However, the existing `no-underscore-dangle` rule already takes care of this.
      '@typescript-eslint/naming-convention': [
        'error',
        // Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables (23.10)
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        // Allow camelCase functions (23.2), and PascalCase functions (23.8)
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        // Airbnb recommends PascalCase for classes (23.3), and although Airbnb does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],

      // Replace Airbnb 'comma-dangle' rule with '@typescript-eslint' version
      // The TypeScript version also adds 3 new options, all of which should be set to the same value as the base config
      'comma-dangle': 'off',
      '@typescript-eslint/comma-dangle': [
        baseStyleRules['comma-dangle'][0],
        {
          ...baseStyleRules['comma-dangle'][1],
          enums: baseStyleRules['comma-dangle'][1].arrays,
          generics: baseStyleRules['comma-dangle'][1].arrays,
          tuples: baseStyleRules['comma-dangle'][1].arrays,
        },
      ],

      // Replace Airbnb 'comma-spacing' rule with '@typescript-eslint' version
      'comma-spacing': 'off',
      '@typescript-eslint/comma-spacing': baseStyleRules['comma-spacing'],

      // Replace Airbnb 'default-param-last' rule with '@typescript-eslint' version
      'default-param-last': 'off',
      '@typescript-eslint/default-param-last':
        baseBestPracticesRules['default-param-last'],

      // Replace Airbnb 'dot-notation' rule with '@typescript-eslint' version
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': baseBestPracticesRules['dot-notation'],

      // Replace Airbnb 'func-call-spacing' rule with '@typescript-eslint' version
      'func-call-spacing': 'off',
      '@typescript-eslint/func-call-spacing':
        baseStyleRules['func-call-spacing'],

      // Replace Airbnb 'indent' rule with '@typescript-eslint' version
      indent: 'off',
      '@typescript-eslint/indent': baseStyleRules.indent,

      // Replace Airbnb 'keyword-spacing' rule with '@typescript-eslint' version
      'keyword-spacing': 'off',
      '@typescript-eslint/keyword-spacing': baseStyleRules['keyword-spacing'],

      // Replace Airbnb 'lines-between-class-members' rule with '@typescript-eslint' version
      'lines-between-class-members': 'off',
      '@typescript-eslint/lines-between-class-members':
        baseStyleRules['lines-between-class-members'],

      // Replace Airbnb 'no-array-constructor' rule with '@typescript-eslint' version
      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor':
        baseStyleRules['no-array-constructor'],

      // Replace Airbnb 'no-dupe-class-members' rule with '@typescript-eslint' version
      'no-dupe-class-members': 'off',
      '@typescript-eslint/no-dupe-class-members':
        baseES6Rules['no-dupe-class-members'],

      // Replace Airbnb 'no-empty-function' rule with '@typescript-eslint' version
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function':
        baseBestPracticesRules['no-empty-function'],

      // Replace Airbnb 'no-extra-parens' rule with '@typescript-eslint' version
      'no-extra-parens': 'off',
      '@typescript-eslint/no-extra-parens': baseErrorsRules['no-extra-parens'],

      // Replace Airbnb 'no-extra-semi' rule with '@typescript-eslint' version
      'no-extra-semi': 'off',
      '@typescript-eslint/no-extra-semi': baseErrorsRules['no-extra-semi'],

      // Replace Airbnb 'no-implied-eval' and 'no-new-func' rules with '@typescript-eslint' version
      'no-implied-eval': 'off',
      'no-new-func': 'off',
      '@typescript-eslint/no-implied-eval':
        baseBestPracticesRules['no-implied-eval'],

      // Replace Airbnb 'no-loss-of-precision' rule with '@typescript-eslint' version
      'no-loss-of-precision': 'off',
      '@typescript-eslint/no-loss-of-precision':
        baseErrorsRules['no-loss-of-precision'],

      // Replace Airbnb 'no-loop-func' rule with '@typescript-eslint' version
      'no-loop-func': 'off',
      '@typescript-eslint/no-loop-func': baseBestPracticesRules['no-loop-func'],

      // Replace Airbnb 'no-magic-numbers' rule with '@typescript-eslint' version
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers':
        baseBestPracticesRules['no-magic-numbers'],

      // Replace Airbnb 'no-redeclare' rule with '@typescript-eslint' version
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': baseBestPracticesRules['no-redeclare'],

      // Replace Airbnb 'no-shadow' rule with '@typescript-eslint' version
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': baseVariablesRules['no-shadow'],

      // Replace Airbnb 'space-before-blocks' rule with '@typescript-eslint' version
      'space-before-blocks': 'off',
      '@typescript-eslint/space-before-blocks':
        baseStyleRules['space-before-blocks'],

      // Replace Airbnb 'no-throw-literal' rule with '@typescript-eslint' version
      'no-throw-literal': 'off',
      '@typescript-eslint/no-throw-literal':
        baseBestPracticesRules['no-throw-literal'],

      // Replace Airbnb 'no-unused-expressions' rule with '@typescript-eslint' version
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions':
        baseBestPracticesRules['no-unused-expressions'],

      // Replace Airbnb 'no-unused-vars' rule with '@typescript-eslint' version
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': baseVariablesRules['no-unused-vars'],

      // Replace Airbnb 'no-use-before-define' rule with '@typescript-eslint' version
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define':
        baseVariablesRules['no-use-before-define'],

      // Replace Airbnb 'no-useless-constructor' rule with '@typescript-eslint' version
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor':
        baseES6Rules['no-useless-constructor'],

      // Replace Airbnb 'quotes' rule with '@typescript-eslint' version
      quotes: 'off',
      '@typescript-eslint/quotes': baseStyleRules.quotes,

      // Replace Airbnb 'semi' rule with '@typescript-eslint' version
      semi: 'off',
      '@typescript-eslint/semi': baseStyleRules.semi,

      // Replace Airbnb 'space-before-function-paren' rule with '@typescript-eslint' version
      'space-before-function-paren': 'off',
      '@typescript-eslint/space-before-function-paren':
        baseStyleRules['space-before-function-paren'],

      // Replace Airbnb 'require-await' rule with '@typescript-eslint' version
      'require-await': 'off',
      '@typescript-eslint/require-await':
        baseBestPracticesRules['require-await'],

      // Replace Airbnb 'no-return-await' rule with '@typescript-eslint' version
      'no-return-await': 'off',
      '@typescript-eslint/return-await': [
        baseBestPracticesRules['no-return-await'],
        'in-try-catch',
      ],

      // Replace Airbnb 'space-infix-ops' rule with '@typescript-eslint' version
      'space-infix-ops': 'off',
      '@typescript-eslint/space-infix-ops': baseStyleRules['space-infix-ops'],

      // Replace Airbnb 'object-curly-spacing' rule with '@typescript-eslint' version
      'object-curly-spacing': 'off',
      '@typescript-eslint/object-curly-spacing':
        baseStyleRules['object-curly-spacing'],

      // Append 'ts' and 'tsx' to Airbnb 'import/extensions' rule
      'import/extensions': [
        baseImportsRules['import/extensions'][0],
        baseImportsRules['import/extensions'][1],
        {
          ...baseImportsRules['import/extensions'][2],
          ts: 'never',
          tsx: 'never',
        },
      ],

      // Append 'ts' and 'tsx' extensions to Airbnb 'import/no-extraneous-dependencies' rule
      'import/no-extraneous-dependencies': [
        baseImportsRules['import/no-extraneous-dependencies'][0],
        {
          ...baseImportsRules['import/no-extraneous-dependencies'][1],
          devDependencies: baseImportsRules[
            'import/no-extraneous-dependencies'
          ][1].devDependencies.reduce((result, devDep) => {
            const toAppend = [devDep]
            const devDepWithTs = devDep.replace(/\bjs(x?)\b/g, 'ts$1')
            if (devDepWithTs !== devDep) {
              toAppend.push(devDepWithTs)
            }
            return [...result, ...toAppend]
          }, []),
        },
      ],
    },
  },
]
