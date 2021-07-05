module.exports = {
  extends: [
    'eslint-config-airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    require.resolve('./shared'),
  ],
  plugins: ['@typescript-eslint'],
}
