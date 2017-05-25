module.exports = {
  paths: (paths, { resolvePath }) => {
    const sourcesToCompile = paths.sourcesToCompile.concat([
      resolvePath('../src'),
      resolvePath('../index.web.js'),
      resolvePath('../node_modules/react-native-vector-icons'),
      resolvePath('../node_modules/react-native-tab-view/src'),
    ])

    return Object.assign({}, paths, { sourcesToCompile })
  },

  webpack: (oldConfig, { isDevelopment }) => {
    const babelLoader = require.resolve('babel-loader')
    const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
    const webpack = require('webpack')

    return Object.assign({}, oldConfig, {
      module: Object.assign({}, oldConfig.module, {
        rules: oldConfig.module.rules.map(rule => {
          if (rule.loader === babelLoader) {
            return Object.assign({}, rule, {
              options: Object.assign({}, rule.options, {
                plugins: (rule.options.plugins || [])
                  .concat([
                    require.resolve('babel-plugin-transform-decorators-legacy'),
                  ]),
              }),
            })
          }

          return rule
        }),
      }),
      plugins: oldConfig.plugins.concat([
        new webpack.DefinePlugin({ __DEV__: isDevelopment }),
      ]),
      resolve: Object.assign({}, oldConfig.resolve, {
        alias: Object.assign({}, oldConfig.resolve.alias, {
          'react-navigation': 'react-navigation/lib/react-navigation.js',
        }),
        extensions: ['.web.js'].concat(oldConfig.resolve.extensions),
        plugins: oldConfig.resolve.plugins.filter(
          plugin => !(plugin instanceof ModuleScopePlugin),
        ),
      }),
    })
  },
}
