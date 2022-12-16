module.exports = {
  plugins: ['@emotion'],
  rules: {
    '@emotion/import-from-emotion': 'error',
    '@emotion/no-vanilla': 'error',
    '@emotion/styled-import': 'error',
    '@emotion/syntax-preference': ['error', 'string'],
  },
}
