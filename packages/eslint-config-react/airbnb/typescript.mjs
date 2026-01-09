import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const compat = new FlatCompat({
  baseDirectory: dirname,
})

const config = compat.extends('airbnb-base')

const defaultAirBnbRules = [...fixupPluginRules(config)].reduce(
  (acc, currentConfig) => ({
    ...acc,
    ...currentConfig.rules,
  }),
  {},
)

const defaultAirbnb = [
  ...fixupConfigRules(compat.extends('airbnb-base')),
  {
    rules: {
      '@typescript-eslint/default-param-last':
        defaultAirBnbRules['default-param-last'],
      '@typescript-eslint/dot-notation': defaultAirBnbRules['dot-notation'],
      // The `@typescript-eslint/naming-convention` rule allows `leadingUnderscore` and `trailingUnderscore` settings. However, the existing `no-underscore-dangle` rule already takes care of this.
      '@typescript-eslint/naming-convention': [
        'error',
        // Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables (23.10)
        {
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          selector: 'variable',
        },
        // Allow camelCase functions (23.2), and PascalCase functions (23.8)
        {
          format: ['camelCase', 'PascalCase'],
          selector: 'function',
        },
        // Airbnb recommends PascalCase for classes (23.3), and although Airbnb does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
        {
          format: ['PascalCase'],
          selector: 'typeLike',
        },
      ],
      '@typescript-eslint/no-array-constructor':
        defaultAirBnbRules['no-array-constructor'],
      '@typescript-eslint/no-dupe-class-members':
        defaultAirBnbRules['no-dupe-class-members'],
      '@typescript-eslint/no-empty-function':
        defaultAirBnbRules['no-empty-function'],
      '@typescript-eslint/no-extra-parens':
        defaultAirBnbRules['no-extra-parens'],
      '@typescript-eslint/no-implied-eval':
        defaultAirBnbRules['no-implied-eval'],
      '@typescript-eslint/no-loop-func': defaultAirBnbRules['no-loop-func'],
      '@typescript-eslint/no-loss-of-precision':
        defaultAirBnbRules['no-loss-of-precision'],
      '@typescript-eslint/no-magic-numbers':
        defaultAirBnbRules['no-magic-numbers'],
      '@typescript-eslint/no-redeclare': defaultAirBnbRules['no-redeclare'],
      '@typescript-eslint/no-shadow': defaultAirBnbRules['no-shadow'],
      '@typescript-eslint/no-unused-expressions':
        defaultAirBnbRules['no-unused-expressions'],
      '@typescript-eslint/no-unused-vars': defaultAirBnbRules['no-unused-vars'],
      '@typescript-eslint/no-use-before-define':
        defaultAirBnbRules['no-use-before-define'],
      '@typescript-eslint/no-useless-constructor':
        defaultAirBnbRules['no-useless-constructor'],
      '@typescript-eslint/require-await': defaultAirBnbRules['require-await'],
      '@typescript-eslint/return-await': [
        defaultAirBnbRules['no-return-await'],
        'in-try-catch',
      ],
      // Replace Airbnb 'camelcase' rule with '@typescript-eslint/naming-convention'
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
      camelcase: 'off',

      // Replace Airbnb 'default-param-last' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/default-param-last.md
      'default-param-last': 'off',

      // Replace Airbnb 'dot-notation' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/dot-notation.md
      'dot-notation': 'off',

      // Append 'ts' and 'tsx' to Airbnb 'import/extensions' rule
      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
      'import/extensions': [
        defaultAirBnbRules['import/extensions'][0],
        defaultAirBnbRules['import/extensions'][1],
        {
          ...defaultAirBnbRules['import/extensions'][2],
          ts: 'never',
          tsx: 'never',
        },
      ],

      // Append 'ts' and 'tsx' extensions to Airbnb 'import/no-extraneous-dependencies' rule
      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
      'import/no-extraneous-dependencies': [
        defaultAirBnbRules['import/no-extraneous-dependencies'][0],
        {
          ...defaultAirBnbRules['import/no-extraneous-dependencies'][1],
          devDependencies: defaultAirBnbRules[
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

      // Replace Airbnb 'no-array-constructor' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-array-constructor.md
      'no-array-constructor': 'off',

      // Replace Airbnb 'no-dupe-class-members' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-dupe-class-members.md
      'no-dupe-class-members': 'off',

      // Replace Airbnb 'no-empty-function' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
      'no-empty-function': 'off',

      // Replace Airbnb 'no-extra-parens' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-parens.md
      'no-extra-parens': 'off',

      // Replace Airbnb 'no-implied-eval' and 'no-new-func' rules with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implied-eval.md
      'no-implied-eval': 'off',

      // Replace Airbnb 'no-loop-func' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loop-func.md
      'no-loop-func': 'off',

      // Replace Airbnb 'no-loss-of-precision' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loss-of-precision.md
      'no-loss-of-precision': 'off',

      // Replace Airbnb 'no-magic-numbers' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-magic-numbers.md
      'no-magic-numbers': 'off',
      'no-new-func': 'off',

      // Replace Airbnb 'no-redeclare' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-redeclare.md
      'no-redeclare': 'off',

      // Replace Airbnb 'no-return-await' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
      'no-return-await': 'off',

      // Replace Airbnb 'no-shadow' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
      'no-shadow': 'off',

      // Replace Airbnb 'no-unused-expressions' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
      'no-unused-expressions': 'off',

      // Replace Airbnb 'no-unused-vars' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
      'no-unused-vars': 'off',

      // Replace Airbnb 'no-use-before-define' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
      'no-use-before-define': 'off',

      // Replace Airbnb 'no-useless-constructor' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-useless-constructor.md
      'no-useless-constructor': 'off',

      // Replace Airbnb 'quotes' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/quotes.md
      quotes: 'off',
      // '@typescript-eslint/quotes': defaultAirBnbRules.quotes,

      // Replace Airbnb 'require-await' rule with '@typescript-eslint' version
      // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/require-await.md
      'require-await': 'off',
    },
  },
]

export default defaultAirbnb
