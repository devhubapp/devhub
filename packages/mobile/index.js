import React from 'react'
import { AppRegistry, View } from 'react-native'
import { useScreens } from 'react-native-screens'
import {
  GoogleAnalyticsSettings,
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge'

import { App } from 'shared-components/dist/components/App'

export const tracker = new GoogleAnalyticsTracker('UA-52350759-2')
GoogleAnalyticsSettings.setDispatchInterval(10)
GoogleAnalyticsSettings.setDryRun(__DEV__)

useScreens()

AppRegistry.registerComponent('devhub', () => App)
