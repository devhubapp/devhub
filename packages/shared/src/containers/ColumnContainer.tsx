import _ from 'lodash'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { EventColumn } from '../components/columns/EventColumn'
import { NotificationColumn } from '../components/columns/NotificationColumn'
import * as selectors from '../redux/selectors'
import { ExtractPropsFromConnector } from '../types'

export interface ColumnContainerProps {
  columnId: string
  pagingEnabled?: boolean
  swipeable?: boolean
}

export interface ColumnContainerState {}

const connectToStore = connect(() => {
  const columnSelector = selectors.createColumnSelector()

  return (state: any, { columnId }: ColumnContainerProps) => ({
    column: columnSelector(state, columnId),
    columnIndex: selectors.columnIdsSelector(state).indexOf(columnId),
  })
})

class ColumnContainerComponent extends PureComponent<
  ColumnContainerProps & ExtractPropsFromConnector<typeof connectToStore>,
  ColumnContainerState
> {
  render() {
    const {
      columnIndex,
      column,
      pagingEnabled,
      swipeable,
      ...props
    } = this.props
    delete props.columnId

    if (!column) return null

    switch (column.type) {
      case 'notifications': {
        return (
          <NotificationColumn
            key={`notification-column-${column.id}`}
            column={column}
            columnIndex={columnIndex}
            pagingEnabled={pagingEnabled}
            swipeable={swipeable}
          />
        )
      }

      case 'activity': {
        return (
          <EventColumn
            key={`event-column-${column.id}`}
            column={column}
            columnIndex={columnIndex}
            pagingEnabled={pagingEnabled}
            swipeable={swipeable}
          />
        )
      }

      default: {
        console.error('Invalid Column type: ', (column as any).type)
        return null
      }
    }
  }
}

export const ColumnContainer = connectToStore(ColumnContainerComponent)
