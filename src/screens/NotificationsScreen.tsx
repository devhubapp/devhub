import React, { PureComponent } from 'react'
// import { Alert } from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import Screen from '../components/common/Screen'
import NotificationCardsContainer from '../containers/NotificationCardsContainer'

export default class NotificationsScreen extends PureComponent<
  NavigationScreenProps
> {
  static navigationOptions: NavigationStackScreenOptions = {
    headerTitle: 'Notifications',
  }

  handlePress = () => {
    // Alert.alert('Pressed!', 'Not implemented.')
  }

  render() {
    return (
      <Screen>
        <NotificationCardsContainer />
      </Screen>
    )
  }
}
