import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import stylisticPlugin from '@stylistic/eslint-plugin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const compat = new FlatCompat({
  baseDirectory: dirname,
})

const config = compat.extends('airbnb-base')

const defaultAirBnbRules = [...fixupPluginRules(config)].reduce(
  (acc, currentConfig) => ({
    // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
    ...acc,
    ...currentConfig.rules,
  }),
  {},
)

export default [
  {
    plugins: {
      '@stylistic': stylisticPlugin,
    },
  },
  stylisticPlugin.configs['disable-legacy'],
  stylisticPlugin.configs['recommended-flat'],
  {
    rules: {
      // --- Should be done when using biome/prettier formatter --- //
      '@stylistic/quotes': 'off',
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/indent': 'off',
      '@stylistic/quote-props': 'off',
      '@stylistic/indent-binary-ops': 'off',
      '@stylistic/arrow-parens': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/no-trailing-spaces': 'off',
      '@stylistic/comma-style': 'off',
      '@stylistic/func-call-spacing': 'off',
      '@stylistic/jsx-wrap-multilines': 'off',
      '@stylistic/member-delimiter-style': 'off',
      '@stylistic/jsx-curly-brace-presence': 'off',
      '@stylistic/jsx-curly-newline': 'off',
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/max-statements-per-line ': 'off',
      // -------------------------------------- ///

      '@stylistic/brace-style': defaultAirBnbRules['brace-style'],
      '@stylistic/comma-dangle': [
        defaultAirBnbRules['comma-dangle'][0],
        {
          ...defaultAirBnbRules['comma-dangle'][1],
          enums: defaultAirBnbRules['comma-dangle'][1].arrays,
          generics: defaultAirBnbRules['comma-dangle'][1].arrays,
          tuples: defaultAirBnbRules['comma-dangle'][1].arrays,
        },
      ],
      '@stylistic/comma-spacing': defaultAirBnbRules['comma-spacing'],
      '@stylistic/func-call-spacing': defaultAirBnbRules['func-call-spacing'],
      '@stylistic/keyword-spacing': defaultAirBnbRules['keyword-spacing'],
      '@stylistic/no-extra-semi': defaultAirBnbRules['no-extra-semi'],
      '@stylistic/object-curly-spacing':
        defaultAirBnbRules['object-curly-spacing'],
      semi: 'off',
      '@stylistic/semi': 'off',
      '@stylistic/space-before-blocks':
        defaultAirBnbRules['space-before-blocks'],
      '@stylistic/space-before-function-paren':
        defaultAirBnbRules['space-before-function-paren'],
      '@stylistic/space-infix-ops': defaultAirBnbRules['space-infix-ops'],
      '@stylistic/lines-between-class-members':
        defaultAirBnbRules['lines-between-class-members'],
    },
  },
]
