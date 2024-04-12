const emotion = require('@emotion/eslint-plugin')

module.exports = [
  { plugins: { '@emotion': emotion } },
  {
    rules: {
      'react/no-unknown-property': [
        'error',
        {
          ignore: ['css'],
        },
      ],
      '@emotion/import-from-emotion': 'error',
      '@emotion/no-vanilla': 'error',
      '@emotion/styled-import': 'error',
      '@emotion/syntax-preference': ['error', 'string'],
    },
  },
]
