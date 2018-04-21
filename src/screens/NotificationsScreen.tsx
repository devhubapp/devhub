import React, { PureComponent } from 'react'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import Columns from '../components/columns/Columns'
import NotificationColumn from '../components/columns/NotificationColumn'
import Screen from '../components/common/Screen'

export default class NotificationsScreen extends PureComponent<
  NavigationScreenProps
> {
  static navigationOptions: NavigationStackScreenOptions = {
    header: null,
  }

  render() {
    return (
      <Screen>
        <Columns>
          <NotificationColumn />
          <NotificationColumn />
        </Columns>
      </Screen>
    )
  }
}
