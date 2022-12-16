module.exports = {
  extends: [
    'eslint-config-airbnb',
    'eslint-config-airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    require.resolve('./shared'),
  ],
  plugins: ['deprecation', '@typescript-eslint'],
  rules: {
    'deprecation/deprecation': 'warn',
    // https://github.com/typescript-eslint/typescript-eslint/issues/4619
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    // We favor object defaults instead of default props in TS
    // https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/default_props/#you-may-not-need-defaultprops
    // https://twitter.com/dan_abramov/status/1133878326358171650
    'react/require-default-props': 'off',
  },
}
