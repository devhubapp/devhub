import React, { PureComponent } from 'react'

import Screen from '../components/common/Screen'
import { EventColumnsContainer } from '../containers/EventColumnsContainer'

export default class MainScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <EventColumnsContainer includeNotificationsColumn />
      </Screen>
    )
  }
}
