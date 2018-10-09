import _ from 'lodash'
import React, { Fragment, PureComponent } from 'react'

import Columns from '../components/columns/Columns'
import EventColumn from '../components/columns/EventColumn'
import NotificationColumn from '../components/columns/NotificationColumn'
import { UserConsumer } from '../components/context/UserContext'

export interface EventColumnsContainerProps {
  includeNotificationsColumn?: boolean
}

export interface EventColumnsContainerState {}

export class EventColumnsContainer extends PureComponent<
  EventColumnsContainerProps,
  EventColumnsContainerState
> {
  state = {}

  render() {
    const { includeNotificationsColumn } = this.props

    return (
      <Columns>
        <UserConsumer>
          {({ accessToken, user }) =>
            !(user && accessToken) ? null : (
              <Fragment>
                {!!includeNotificationsColumn && (
                  <NotificationColumn accessToken={accessToken} />
                )}

                <EventColumn
                  accessToken={accessToken}
                  subtype="received_events"
                  type="users"
                  username={user.login}
                />
                <EventColumn
                  accessToken={accessToken}
                  subtype="events"
                  type="users"
                  username={user.login}
                />
                <EventColumn
                  accessToken={accessToken}
                  showAvatarAsIcon
                  subtype="events"
                  type="orgs"
                  username="facebook"
                />
                <EventColumn
                  accessToken={accessToken}
                  repoIsKnown
                  showAvatarAsIcon
                  subtype="events"
                  type="repos"
                  username="facebook/react"
                />
              </Fragment>
            )
          }
        </UserConsumer>
      </Columns>
    )
  }
}
