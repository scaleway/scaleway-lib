module.exports = {
  extends: ['airbnb/hooks', 'prettier'],
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: false,
          order: 'asc',
        },
        groups: [
          ['builtin', 'external'],
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'never',
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        next: 'return',
        prev: '*',
      },
    ],
    'react/jsx-no-constructed-context-values': 'warn',
    'react/jsx-no-script-url': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/no-adjacent-inline-elements': 'error',
    'react/sort-prop-types': [
      'error',
      { ignoreCase: true, requiredFirst: false, sortShapeProp: true },
    ],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: ['single', 'multiple', 'all', 'none'],
      },
    ],
    'sort-keys': ['error', 'asc', { caseSensitive: false, natural: true }],
  },
}
