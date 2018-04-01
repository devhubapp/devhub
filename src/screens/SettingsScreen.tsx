import React, { PureComponent } from 'react'
import { View } from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import Screen from '../components/common/Screen'

export default class SettingsScreen extends PureComponent<
  NavigationScreenProps
> {
  static navigationOptions: NavigationStackScreenOptions = {
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
