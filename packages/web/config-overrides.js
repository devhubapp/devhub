const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const appIncludes = [
  resolveApp('src'),
  resolveApp('../core/src'),
  resolveApp('../components/src'),
  resolveApp('../../node_modules/react-native-gesture-handler/'),
  resolveApp('../../node_modules/react-native-haptic-feedback/'),
  resolveApp('../../node_modules/react-native-vector-icons/'),
]

module.exports = function override(config, env) {
  const __DEV__ = env !== 'production'

  config.resolve.alias['deepmerge$'] = 'deepmerge/dist/umd.js'

  // allow importing from outside of src folder
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => plugin.constructor.name !== 'ModuleScopePlugin',
  )

  config.module.rules[0].include = appIncludes
  config.module.rules[1] = null
  config.module.rules[2].oneOf[1].include = appIncludes
  config.module.rules[2].oneOf[1].options.plugins = [
    require.resolve('babel-plugin-react-native-web'),
  ].concat(config.module.rules[2].oneOf[1].options.plugins)

  config.plugins.push(new webpack.DefinePlugin({ __DEV__ }))

  if (__DEV__) {
    // fast refresh
    config.plugins.push(
      new ReactRefreshWebpackPlugin({ forceEnable: true }),
    )
    config.module.rules[2].oneOf[1].options.plugins.push(
      require.resolve('react-refresh/babel'),
    )
  }

  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'report.html',
    }),
  )

  config.module.rules = config.module.rules.filter(Boolean)

  return config
}
