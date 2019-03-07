import React from 'react'

import { EventColumn } from '../components/columns/EventColumn'
import { NotificationColumn } from '../components/columns/NotificationColumn'
import { useColumn } from '../hooks/use-column'
import { useReduxState } from '../hooks/use-redux-state'
import { bugsnag } from '../libs/bugsnag'
import * as selectors from '../redux/selectors'

export interface ColumnContainerProps {
  columnId: string
  disableColumnOptions?: boolean
  pagingEnabled?: boolean
  swipeable?: boolean
}

export const ColumnContainer = React.memo((props: ColumnContainerProps) => {
  const { columnId, disableColumnOptions, pagingEnabled, swipeable } = props

  const { column, columnIndex, subscriptions } = useColumn(columnId)

  const appViewMode = useReduxState(selectors.viewModeSelector)

  if (!column) return null

  switch (column.type) {
    case 'activity': {
      return (
        <EventColumn
          key={`event-column-${column.id}`}
          column={column}
          columnIndex={columnIndex}
          disableColumnOptions={disableColumnOptions}
          pagingEnabled={pagingEnabled}
          subscriptions={subscriptions}
          swipeable={swipeable}
          appViewMode={appViewMode}
        />
      )
    }

    case 'notifications': {
      return (
        <NotificationColumn
          key={`notification-column-${column.id}`}
          column={column}
          columnIndex={columnIndex}
          disableColumnOptions={disableColumnOptions}
          pagingEnabled={pagingEnabled}
          subscriptions={subscriptions}
          swipeable={swipeable}
          appViewMode={appViewMode}
        />
      )
    }

    default: {
      const message = `Invalid Column type: ${(column as any).type}`
      console.error(message)
      bugsnag.notify(new Error(message))
      return null
    }
  }
})
