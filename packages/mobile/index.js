import React from 'react'
import { AppRegistry, View } from 'react-native'
import { useScreens } from 'react-native-screens'

import { App } from 'shared/dist/components/App'

useScreens()

AppRegistry.registerComponent('devhub', () => App)
