const base = require('../.eslintrc')

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'react/react-in-jsx-scope': 'off',
  },
}
