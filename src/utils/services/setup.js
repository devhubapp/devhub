/* eslint-disable global-require */

export default (process.env.NODE_ENV === 'production'
  ? require('./setup.prod').default
  : require('./setup.dev').default)
