const airbnbConfig = require('eslint-config-airbnb')
const sharedConfig = require('./shared')

module.exports = [
  airbnbConfig,
  sharedConfig,
  {
    rules: {
      'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
    },
  },
]
