const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const appIncludes = [
  resolveApp('src'),
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
  // allow importing from outside of src folder
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => plugin.constructor.name !== 'ModuleScopePlugin',
  )

  config.module.rules[0].include = appIncludes
  config.module.rules[1].oneOf[1].include = appIncludes
  config.module.rules[1].oneOf[2].include = appIncludes

  // https://github.com/wmonk/create-react-app-typescript/issues/245#issue-293342718
  config.plugins = config.plugins.filter(
    plugin => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin',
  )

  config.plugins.push(
    new webpack.DefinePlugin({ __DEV__: env !== 'production' }),
  )

  return config
}
