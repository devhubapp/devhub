const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const ReactNativeWebPlugin = require('babel-plugin-react-native-web')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = function override(config, env) {
  config.resolve.alias['deepmerge$'] = 'deepmerge/dist/umd.js'

  config.module.rules[1] = null
  config.module.rules[2].oneOf[1].options.plugins = [
    require.resolve('babel-plugin-react-native-web'),
  ].concat(config.module.rules[2].oneOf[1].options.plugins)
  config.module.rules = config.module.rules.filter(Boolean)

  config.plugins.push(
    new webpack.DefinePlugin({ __DEV__: env !== 'production' }),
  )

  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'report.html',
    }),
  )

  return config
}
