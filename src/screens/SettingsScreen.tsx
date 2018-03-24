import React, { PureComponent } from 'react'
import { View } from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import Screen from '../components/common/Screen'
import theme from '../styles/themes/dark'

export default class SettingsScreen extends PureComponent<
  NavigationScreenProps
> {
  static navigationOptions: NavigationStackScreenOptions = {
    headerBackground: theme.base00,
    headerTitle: 'Settings',
  }

  render() {
    return (
      <Screen>
        <View />
      </Screen>
    )
  }
}
