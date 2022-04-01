const { join } = require('path')

module.exports = {
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { packageDir: [__dirname, join(__dirname, '../../')] },
    ],
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  },
}
