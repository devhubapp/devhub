import _ from 'lodash'
import React, { PureComponent } from 'react'

import { EventColumn } from '../components/columns/EventColumn'
import { NotificationColumn } from '../components/columns/NotificationColumn'
import { ColumnRP } from '../render-props/ColumnRP'

export interface ColumnContainerProps {
  columnId: string
  pagingEnabled?: boolean
  swipeable?: boolean
}

export interface ColumnContainerState {}

export class ColumnContainer extends PureComponent<
  ColumnContainerProps,
  ColumnContainerState
> {
  render() {
    const { columnId, pagingEnabled, swipeable } = this.props

    return (
      <ColumnRP
        key={`column-container-column-rp-${columnId}`}
        columnId={columnId}
      >
        {({ column, columnIndex, subscriptions }) => {
          if (!column) return null

          switch (column.type) {
            case 'activity': {
              return (
                <EventColumn
                  key={`event-column-${column.id}`}
                  column={column}
                  columnIndex={columnIndex}
                  pagingEnabled={pagingEnabled}
                  subscriptions={subscriptions}
                  swipeable={swipeable}
                />
              )
            }

            case 'notifications': {
              return (
                <NotificationColumn
                  key={`notification-column-${column.id}`}
                  column={column}
                  columnIndex={columnIndex}
                  pagingEnabled={pagingEnabled}
                  subscriptions={subscriptions}
                  swipeable={swipeable}
                />
              )
            }

            default: {
              console.error('Invalid Column type: ', (column as any).type)
              return null
            }
          }
        }}
      </ColumnRP>
    )
  }
}
