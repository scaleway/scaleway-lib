module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: ['single', 'multiple', 'all', 'none'],
      },
    ],

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
    'react/jsx-no-constructed-context-values': 'warn',
  },
}
