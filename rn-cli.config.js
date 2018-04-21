const blacklist = require('metro/src/blacklist') // eslint-disable-line

module.exports = {
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer')
  },

  getSourceExts() {
    return ['ts', 'tsx']
  },

  // Workaround for RN 0.52 issue with react-native-vector-icons
  // See: https://github.com/oblador/react-native-vector-icons/issues/626#issuecomment-357469857
  getBlacklistRE() {
    return blacklist([
      /\.history.*/,
      /react-native\/local-cli\/core\/__fixtures__.*/,
    ])
  },
}
