import _ from 'lodash'
import React, { PureComponent } from 'react'

import { Columns } from '../components/columns/Columns'
import { EventColumn } from '../components/columns/EventColumn'
import { NotificationColumn } from '../components/columns/NotificationColumn'
import { ColumnsConsumer } from '../components/context/ColumnsContext'
import { UserConsumer } from '../components/context/UserContext'

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
      <UserConsumer>
        {({ accessToken }) => (
          <ColumnsConsumer>
            {({ columns: _columns }) => {
              if (!(accessToken && _columns)) return null

              const columns = onlyNotifications
                ? _columns.filter(column => column.type === 'notifications')
                : onlyEvents
                  ? _columns.filter(column => column.type !== 'notifications')
                  : _columns

              const swipeable = columns.length === 1

              return (
                <Columns bounces={!swipeable} scrollEnabled={!swipeable}>
                  {columns.map(
                    (column, index) =>
                      (column.type === 'notifications' && (
                        <NotificationColumn
                          key={`event-column-${index}`}
                          column={column}
                          swipeable={swipeable}
                        />
                      )) ||
                      (column.type === 'activity' && (
                        <EventColumn
                          key={`event-column-${index}`}
                          column={column}
                          swipeable={swipeable}
                        />
                      )),
                  )}
                </Columns>
              )
            }}
          </ColumnsConsumer>
        )}
      </UserConsumer>
    )
  }
}
