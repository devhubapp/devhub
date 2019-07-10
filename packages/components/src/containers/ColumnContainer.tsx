import React from 'react'

import { EventColumn } from '../components/columns/EventColumn'
import { IssueOrPullRequestColumn } from '../components/columns/IssueOrPullRequestColumn'
import { NotificationColumn } from '../components/columns/NotificationColumn'
import { useColumn } from '../hooks/use-column'
import { bugsnag } from '../libs/bugsnag'
import { FlatListProps } from '../libs/flatlist'

export interface ColumnContainerProps {
  columnId: string
  pagingEnabled?: boolean
  swipeable: boolean
  pointerEvents: FlatListProps<any>['pointerEvents']
}

export const ColumnContainer = React.memo((props: ColumnContainerProps) => {
  const { columnId, pagingEnabled, pointerEvents, swipeable } = props

  const { column, columnIndex, headerDetails } = useColumn(columnId)

  if (!(column && columnIndex >= 0 && headerDetails)) return null

  switch (column.type) {
    case 'activity': {
      return (
        <EventColumn
          key={`event-column-${column.id}`}
          column={column}
          columnIndex={columnIndex}
          headerDetails={headerDetails}
          pagingEnabled={pagingEnabled}
          pointerEvents={pointerEvents}
          swipeable={swipeable}
        />
      )
    }

    case 'issue_or_pr': {
      return (
        <IssueOrPullRequestColumn
          key={`issue-or-pr-column-${column.id}`}
          column={column}
          columnIndex={columnIndex}
          headerDetails={headerDetails}
          pagingEnabled={pagingEnabled}
          pointerEvents={pointerEvents}
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
          headerDetails={headerDetails}
          pagingEnabled={pagingEnabled}
          pointerEvents={pointerEvents}
          swipeable={swipeable}
        />
      )
    }

    default: {
      const message = `Invalid Column type: ${column && (column as any).type}`
      console.error(message, { column })
      bugsnag.notify(new Error(message))
      return null
    }
  }
})

ColumnContainer.displayName = 'ColumnContainer'
