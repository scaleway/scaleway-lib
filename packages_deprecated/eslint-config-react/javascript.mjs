import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import airbnb from 'eslint-config-airbnb'
import shared from './shared.mjs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const compat = new FlatCompat({
  baseDirectory: dirname,
})

export const defaultJavascriptRules = [
  ...fixupConfigRules(compat.config(airbnb)),
  ...shared,
  {
    rules: {
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.js'],
        },
      ],
    },
  },
]

export default defaultJavascriptRules
