import React from 'react'
import { AppRegistry, View } from 'react-native'
import { useScreens } from 'react-native-screens'

import { App } from 'shared-components/dist/components/App'

useScreens()

AppRegistry.registerComponent('devhub', () => App)
