import React from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import { ColumnRenderer } from './ColumnRenderer'

export interface EventColumnProps extends EventCardsContainerProps {
  columnIndex: number
  disableColumnOptions?: boolean
  pagingEnabled?: boolean
}

export const EventColumn = React.memo((props: EventColumnProps) => {
  const {
    column,
    columnIndex,
    disableColumnOptions,
    pagingEnabled,
    subscriptions,
  } = props

  const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

  return (
    <ColumnRenderer
      key={`event-column-${column.id}-inner`}
      column={column}
      columnIndex={columnIndex}
      disableColumnOptions={disableColumnOptions}
      owner={requestTypeIconAndData.owner}
      pagingEnabled={pagingEnabled}
      repo={requestTypeIconAndData.repo}
      repoIsKnown={requestTypeIconAndData.repoIsKnown}
      subscriptions={subscriptions}
    >
      <EventCardsContainer
        key={`event-cards-container-${column.id}`}
        repoIsKnown={requestTypeIconAndData.repoIsKnown}
        {...props}
        columnIndex={columnIndex}
      />
    </ColumnRenderer>
  )
})
