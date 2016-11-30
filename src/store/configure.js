/* eslint-disable global-require */

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configure.prod');
} else {
  module.exports = require('./configure.dev');
}
