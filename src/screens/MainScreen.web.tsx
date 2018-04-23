import React, { PureComponent } from 'react'

import Columns from '../components/columns/Columns'
import EventColumn from '../components/columns/EventColumn'
import NotificationColumn from '../components/columns/NotificationColumn'
import Screen from '../components/common/Screen'

export default class MainScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <Columns>
          <NotificationColumn />
          <EventColumn
            subtype="received_events"
            type="users"
            username="brunolemos"
          />
          <EventColumn subtype="events" type="users" username="brunolemos" />
        </Columns>
      </Screen>
    )
  }
}
