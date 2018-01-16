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
        rules: oldConfig.module.rules.map(
          rule =>
            (rule.oneOf && {
              ...rule,
              oneOf: rule.oneOf.map(ruleTransformer),
            }) ||
            (rule.use && { ...rule, use: rule.use.map(ruleTransformer) }) ||
            ruleTransformer(rule),
        ),
      }),
      plugins: [
        new webpack.DefinePlugin({ __DEV__: isDevelopment }),
        ...oldConfig.plugins,
      ],
      resolve: Object.assign({}, oldConfig.resolve, {
        alias: Object.assign({}, oldConfig.resolve.alias, {
          'react-navigation': 'react-navigation/lib/react-navigation.js',
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
