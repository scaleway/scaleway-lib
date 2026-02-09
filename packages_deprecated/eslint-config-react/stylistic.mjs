import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import stylisticPlugin from '@stylistic/eslint-plugin'

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

const defaultStylisticRules = [
  {
    plugins: {
      '@stylistic': stylisticPlugin,
    },
  },
  stylisticPlugin.configs['disable-legacy'],
  stylisticPlugin.configs['recommended'],
  {
    rules: {
      '@stylistic/arrow-parens': 'off',
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
      '@stylistic/comma-style': 'off',
      '@stylistic/indent': 'off',
      '@stylistic/indent-binary-ops': 'off',
      '@stylistic/jsx-curly-brace-presence': 'off',
      '@stylistic/jsx-curly-newline': 'off',
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/jsx-wrap-multilines': 'off',
      // '@stylistic/func-call-spacing': defaultAirBnbRules['func-call-spacing'],
      '@stylistic/keyword-spacing': defaultAirBnbRules['keyword-spacing'],
      '@stylistic/lines-between-class-members':
        defaultAirBnbRules['lines-between-class-members'],
      '@stylistic/max-statements-per-line ': 'off',
      '@stylistic/member-delimiter-style': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/no-extra-semi': defaultAirBnbRules['no-extra-semi'],
      '@stylistic/no-trailing-spaces': 'off',
      '@stylistic/object-curly-spacing':
        defaultAirBnbRules['object-curly-spacing'],
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/quote-props': 'off',
      // --- Should be done when using biome/prettier formatter --- //
      '@stylistic/quotes': 'off',
      '@stylistic/semi': 'off',
      '@stylistic/space-before-blocks':
        defaultAirBnbRules['space-before-blocks'],
      '@stylistic/space-before-function-paren':
        defaultAirBnbRules['space-before-function-paren'],
      '@stylistic/space-infix-ops': defaultAirBnbRules['space-infix-ops'],
      semi: 'off',
    },
  },
]

export { defaultStylisticRules }
export default defaultStylisticRules
