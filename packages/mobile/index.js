import 'react-native-gesture-handler'

import { AppRegistry } from 'react-native'

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

const { App } = require('@devhub/components/src/components/App')

AppRegistry.registerComponent('devhub', () => App)
