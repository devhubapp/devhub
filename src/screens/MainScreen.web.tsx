import React, { Fragment, PureComponent } from 'react'

import Columns from '../components/columns/Columns'
import EventColumn from '../components/columns/EventColumn'
import NotificationColumn from '../components/columns/NotificationColumn'
import Screen from '../components/common/Screen'
import { UserConsumer } from '../components/context/UserContext'

export default class MainScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <Columns>
          <UserConsumer>
            {({ user }) =>
              !(user && user.accessToken) ? null : (
                <Fragment>
                  <NotificationColumn accessToken={user.accessToken} />
                  <EventColumn
                    accessToken={user.accessToken}
                    subtype="received_events"
                    type="users"
                    username={user.usernameToSee}
                  />
                  <EventColumn
                    accessToken={user.accessToken}
                    subtype="events"
                    type="users"
                    username={user.usernameToSee}
                  />
                </Fragment>
              )
            }
          </UserConsumer>
        </Columns>
      </Screen>
    )
  }
}
