import _ from 'lodash'
import React, { Fragment, PureComponent } from 'react'

import Columns from '../components/columns/Columns'
import EventColumn, {
  EventColumnProps,
} from '../components/columns/EventColumn'
import NotificationColumn from '../components/columns/NotificationColumn'
import { UserConsumer } from '../components/context/UserContext'

type Column = Pick<
  EventColumnProps,
  | 'repoIsKnown'
  | 'showAvatarAsIcon'
  | 'subtype'
  | 'swipeable'
  | 'type'
  | 'username'
>

function getFakeColumns(username: string): Column[] {
  return [
    {
      subtype: 'received_events',
      type: 'users',
      username,
    },
    {
      subtype: 'events',
      type: 'users',
      username,
    },
    {
      showAvatarAsIcon: true,
      subtype: 'events',
      type: 'orgs',
      username: 'facebook',
    },
    {
      repoIsKnown: true,
      showAvatarAsIcon: true,
      subtype: 'events',
      type: 'repos',
      username: 'facebook/react',
    },
  ]
}

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
                  <NotificationColumn
                    key="event-column-0"
                    accessToken={accessToken}
                  />
                )}

                {getFakeColumns(user.login).map((column, index) => (
                  <EventColumn
                    key={`event-column-${index + 1}`}
                    accessToken={accessToken}
                    {...column}
                  />
                ))}
              </Fragment>
            )
          }
        </UserConsumer>
      </Columns>
    )
  }
}
