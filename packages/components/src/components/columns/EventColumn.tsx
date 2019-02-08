import React from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import { EventOrNotificationColumn } from './EventOrNotificationColumn'

export interface EventColumnProps extends EventCardsContainerProps {
  columnIndex: number
  pagingEnabled?: boolean
}

export const EventColumn = React.memo((props: EventColumnProps) => {
  const { column, columnIndex, pagingEnabled, subscriptions } = props

  const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

  return (
    <EventOrNotificationColumn
      key={`event-column-${column.id}-inner`}
      column={column}
      columnIndex={columnIndex}
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
    </EventOrNotificationColumn>
  )
})
