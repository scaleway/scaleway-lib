import { rules } from '@emotion/eslint-plugin'
import { fixupPluginRules } from '@eslint/compat'

export const defaultEmotionRules = [
  {
    plugins: {
      '@emotion': fixupPluginRules({ rules }),
    },

    rules: {
      '@emotion/import-from-emotion': 'error',
      '@emotion/no-vanilla': 'error',
      '@emotion/styled-import': 'error',
      '@emotion/syntax-preference': ['error', 'string'],
      'react/no-unknown-property': [
        'error',
        {
          ignore: ['css'],
        },
      ],
    },
  },
]

export default defaultEmotionRules
