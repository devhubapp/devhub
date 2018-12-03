const fs = require('fs')
const path = require('path')
const resolve = require('resolve')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const ReactNativeWebPlugin = require('babel-plugin-react-native-web')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin-alt')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const appIncludes = [
  resolveApp('src'),
  resolveApp('../core/src'),
  resolveApp('../components/src'),
]

module.exports = function override(config, env) {
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
  config.module.rules = config.module.rules.filter(Boolean)

  config.plugins = config.plugins.map(plugin => {
    if (plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin') return plugin

    // This is an attempty to show ts errors of the other workspace packages,
    // but did not work
    return new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync('typescript', {
        basedir: resolveApp('node_modules'),
      }),
      async: false,
      checkSyntacticErrors: true,
      tsconfig: resolveApp('tsconfig.json'),
      compilerOptions: {
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'preserve',
      },
      reportFiles: [
        '**',
        '!**/*.json',
        '!**/__tests__/**',
        '!**/?(*.)(spec|test).*',
        '!src/setupProxy.js',
        '!src/setupTests.*',
      ],
      watch: appIncludes, // <- changed this
      silent: false,
      // formatter: typescriptFormatter,
    })
  })

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
