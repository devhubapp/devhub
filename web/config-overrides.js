const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const appIncludes = [
  resolveApp('src'),
  resolveApp('../index.web.js'),
  resolveApp('../src'),
  resolveApp('../node_modules/react-native-platform-touchable'),
  resolveApp('../node_modules/react-native-safe-area-view'),
  resolveApp('../node_modules/react-native-screens/src/'),
  resolveApp('../node_modules/react-native-tab-view/src'),
  resolveApp('../node_modules/react-native-vector-icons/lib'),
  resolveApp('../node_modules/react-native-web-lists/src'),
  resolveApp('../node_modules/react-navigation-deprecated-tab-navigator/src/'),
  resolveApp('../node_modules/react-navigation-drawer/dist'),
  resolveApp('../node_modules/react-navigation-stack/dist'),
  resolveApp(
    '../node_modules/react-navigation/node_modules/react-navigation-stack/dist',
  ),
  resolveApp(
    '../node_modules/react-navigation-deprecated-tab-navigator/node_modules/react-native-tab-view/src/',
  ),
  resolveApp('../node_modules/react-navigation-tabs/dist'),
  resolveApp(
    '../node_modules/react-navigation-tabs/node_modules/react-native-safe-area-view/',
  ),
  resolveApp(
    '../node_modules/react-navigation-tabs/node_modules/react-native-tab-view/src',
  ),
  resolveApp('../node_modules/react-navigation/src'),
]

module.exports = function override(config, env) {
  config.resolve.alias['react-native'] = resolveApp(
    './node_modules/react-native-web',
  )

  // allow importing from outside of src folder
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => plugin.constructor.name !== 'ModuleScopePlugin',
  )

  config.module.rules[1] = null
  config.module.rules[2].oneOf[1].include = appIncludes
  config.module.rules = config.module.rules.filter(Boolean)

  config.plugins.push(
    new webpack.DefinePlugin({ __DEV__: env !== 'production' }),
  )

  return config
}
