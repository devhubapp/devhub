import React, { Fragment, PureComponent } from 'react'
import {
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import Columns from '../components/columns/Columns'
import EventColumn from '../components/columns/EventColumn'
import Screen from '../components/common/Screen'
import { UserConsumer } from '../components/context/UserContext'

export default class FeedScreen extends PureComponent<NavigationScreenProps> {
  static navigationOptions: NavigationScreenConfig<
    NavigationStackScreenOptions
  > = {
    header: null,
  }

  render() {
    return (
      <Screen>
        <Columns>
          <UserConsumer>
            {({ user }) =>
              !(user && user.accessToken) ? null : (
                <Fragment>
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
