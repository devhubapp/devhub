import React from 'react'
import { AppRegistry } from 'react-native'

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React, {
    exclude: /^Icon|Swipeable/,
  })
}

import App from './src'

AppRegistry.registerComponent('devhub', () => App)
