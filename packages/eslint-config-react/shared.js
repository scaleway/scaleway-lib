module.exports = {
  extends: ['airbnb/hooks', 'prettier'],
  rules: {
    'import/order': [
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/order.md
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
    // This allows us to reenable ForOfStatement.
    // While this has been disabled in airbnb configuration it's native to the browsers we support
    // so the original argument about weight is no up to date https://github.com/airbnb/javascript/issues/1271
    'no-restricted-syntax': [
      // https://eslint.org/docs/rules/no-restricted-syntax#disallow-specified-syntax-no-restricted-syntax
      'error',
      {
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        selector: 'ForInStatement',
      },
      {
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        selector: 'LabeledStatement',
      },
      {
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        selector: 'WithStatement',
      },
    ],
    // This is to have a more breathable codebase
    'padding-line-between-statements': [
      // https://eslint.org/docs/rules/padding-line-between-statements
      'error',
      {
        blankLine: 'always',
        next: 'return',
        prev: '*',
      },
    ],
    // These are rules soon to be enabled by airbnb react config
    // We're getting a head start
    'react/jsx-no-constructed-context-values': 'error', // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-constructed-context-values.md
    'react/jsx-no-script-url': 'error', // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-script-url.md
    'react/jsx-no-useless-fragment': 'error', // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
    'react/no-adjacent-inline-elements': 'error', // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-adjacent-inline-elements.md
    'react/no-unstable-nested-components': 'error', // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unstable-nested-components.md

    // To have consistent ordering in proptypes
    'react/sort-prop-types': [
      // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-prop-types.md
      'error',
      { ignoreCase: true, requiredFirst: false, sortShapeProp: true },
    ],
    // Same but for imports
    'sort-imports': [
      // https://eslint.org/docs/rules/sort-imports
      'error',
      {
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: ['single', 'multiple', 'all', 'none'],
      },
    ],
    'sort-keys': ['error', 'asc', { caseSensitive: false, natural: true }],
  },
}
