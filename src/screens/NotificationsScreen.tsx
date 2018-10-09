import React, { PureComponent } from 'react'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import Screen from '../components/common/Screen'
import { UserConsumer } from '../components/context/UserContext'
import NotificationCardsContainer from '../containers/NotificationCardsContainer'

export class NotificationsScreen extends PureComponent<
  NavigationScreenProps
> {
  static navigationOptions: NavigationStackScreenOptions = {
    headerTitle: 'Notifications',
  }

  render() {
    return (
      <Screen>
        <UserConsumer>
          {({ accessToken }) =>
            !!accessToken && (
              <NotificationCardsContainer accessToken={accessToken} swipeable />
            )
          }
        </UserConsumer>
      </Screen>
    )
  }
}
