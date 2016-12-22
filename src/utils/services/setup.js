/* eslint-disable global-require */

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./setup.prod');
} else {
  module.exports = require('./setup.dev');
}
