import React, { PureComponent } from 'react'
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

  render() {
    return (
      <Screen>
        <NotificationCardsContainer swipeable />
      </Screen>
    )
  }
}
