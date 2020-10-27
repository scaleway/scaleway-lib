module.exports = {
  extends: ['airbnb', 'airbnb/base', 'prettier', 'prettier/react'],
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['react-hooks'],
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        'newlines-between': 'never',
      },
    ],

    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
  },
}
