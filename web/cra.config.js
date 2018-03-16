const babelLoader = require.resolve('babel-loader')
const eslintLoader = require.resolve('eslint-loader')

const ruleTransformer = rule => {
  if (rule.loader === babelLoader) {
    return Object.assign({}, rule, {
      options: Object.assign({}, rule.options, {
        plugins: (rule.options.plugins || []).concat([
          require.resolve('babel-plugin-transform-decorators-legacy'),
        ]),
      }),
    })
  } else if (rule.loader === eslintLoader) {
    return Object.assign({}, rule, {
      options: Object.assign({}, rule.options, {
        ignore: true,
        useEslintrc: true,
      }),
    })
  }

  return rule
}

module.exports = {
  paths: (paths, { resolvePath }) => {
    const sourcesToCompile = paths.sourcesToCompile.concat([
      resolvePath('../src'),
      resolvePath('../index.web.js'),
      resolvePath('../node_modules/react-native-vector-icons'),
      resolvePath('../node_modules/react-native-tab-view/src'),
      resolvePath('../node_modules/react-navigation/src'),
      resolvePath('../node_modules/react-native-safe-area-view'),
    ])

    return Object.assign({}, paths, {
      webNodeModules: resolvePath('node_modules'),
      mobileNodeModules: resolvePath('../node_modules'),
      sourcesToCompile,
    })
  },

  webpack: (oldConfig, { isDevelopment, paths }) => {
    const webpack = require('webpack')

    return Object.assign({}, oldConfig, {
      module: Object.assign({}, oldConfig.module, {
        rules: oldConfig.module.rules.map(rule => {
          let _lastRule

          let updatedRule =
            (rule.oneOf && {
              ...rule,
              oneOf: rule.oneOf.map(rule => {
                _lastRule = ruleTransformer(rule)
                return _lastRule
              }),
            }) ||
            (rule.use && {
              ...rule,
              use: rule.use.map(rule => {
                _lastRule = ruleTransformer(rule)
                return _lastRule
              }),
            }) ||
            (() => {
              _lastRule = ruleTransformer(rule, paths)
              return _lastRule
            })()

          if (_lastRule && _lastRule.loader === eslintLoader) {
            updatedRule = { ...updatedRule, include: [paths.appSrc] }
          }

          return updatedRule
        }),
      }),
      plugins: [
        new webpack.DefinePlugin({ __DEV__: isDevelopment }),
        ...oldConfig.plugins,
      ],
      resolve: Object.assign({}, oldConfig.resolve, {
        alias: Object.assign({}, oldConfig.resolve.alias, {
          'react-navigation': 'react-navigation/src/react-navigation.js',
        }),
        extensions: ['.web.js'].concat(oldConfig.resolve.extensions),
        modules: [paths.webNodeModules, paths.mobileNodeModules].concat(
          oldConfig.resolve.modules,
        ), // eslint-disable-line
        plugins: oldConfig.resolve.plugins.filter(
          plugin => plugin.constructor.name !== 'ModuleScopePlugin',
        ),
      }),
    })
  },
}
