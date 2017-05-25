/* eslint-disable global-require */

export default (process.env.NODE_ENV === 'production'
  ? require('./configure.prod.js').default
  : require('./configure.dev.js').default)
