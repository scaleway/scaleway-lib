module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'prettier', 'prettier/react'],
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
    'react/jsx-no-script-url': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/no-adjacent-inline-elements': 'error',
    'react/jsx-no-constructed-context-values': 'warn'
  },
}
