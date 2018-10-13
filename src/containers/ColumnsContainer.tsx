import _ from 'lodash'
import React, { PureComponent } from 'react'

import Columns from '../components/columns/Columns'
import EventColumn from '../components/columns/EventColumn'
import { NotificationColumn } from '../components/columns/NotificationColumn'
import { UserConsumer } from '../components/context/UserContext'
import { Column } from '../types'

function getFakeColumns(username: string): Column[] {
  return [
    {
      type: 'notifications',
    },
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

export type ColumnsContainerProps =
  | {
      onlyEvents?: true
      onlyNotifications?: false
    }
  | {
      onlyEvents?: false
      onlyNotifications?: true
    }

export interface ColumnsContainerState {}

export class ColumnsContainer extends PureComponent<
  ColumnsContainerProps,
  ColumnsContainerState
> {
  state = {}

  render() {
    const { onlyEvents, onlyNotifications } = this.props

    return (
      <Columns>
        <UserConsumer>
          {({ accessToken, user }) => {
            if (!(user && accessToken)) return null

            const columns = onlyNotifications
              ? getFakeColumns(user.login).filter(
                  column => column.type === 'notifications',
                )
              : onlyEvents
                ? getFakeColumns(user.login).filter(
                    column => column.type !== 'notifications',
                  )
                : getFakeColumns(user.login)

            return columns.map(
              (column, index) =>
                column.type === 'notifications' ? (
                  <NotificationColumn
                    key={`event-column-${index}`}
                    accessToken={accessToken}
                    swipeable={columns.length === 1}
                    {...column}
                  />
                ) : (
                  <EventColumn
                    key={`event-column-${index}`}
                    accessToken={accessToken}
                    {...column}
                  />
                ),
            )
          }}
        </UserConsumer>
      </Columns>
    )
  }
}
