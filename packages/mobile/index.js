import 'react-native-gesture-handler'

import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'

// Intl polyfill
import areIntlLocalesSupported from 'intl-locales-supported'
if (window.Intl) {
  if (!areIntlLocalesSupported(['en', 'br'])) {
    var IntlPolyfill = require('intl')
    window.Intl.NumberFormat = IntlPolyfill.NumberFormat
    window.Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
  }
} else {
  window.Intl = require('intl')
}

// @octokit/rest (universal-user-agent) polyfill for react-native
// @see https://github.com/gr2m/universal-user-agent/issues/37
if (!process.version) {
  process.version = require('@devhub/core/src/utils/constants').APP_VERSION
}

const { App } = require('@devhub/components/src/components/App')

AppRegistry.registerComponent('devhub', () => App)
AppRegistry.registerComponent(appName, () => App)
