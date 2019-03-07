import React from 'react'

import { AppViewMode, getColumnHeaderDetails } from '@devhub/core'
import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import { EventOrNotificationColumn } from './EventOrNotificationColumn'

export interface EventColumnProps extends EventCardsContainerProps {
  columnIndex: number
  disableColumnOptions?: boolean
  pagingEnabled?: boolean
  appViewMode: AppViewMode
}

export const EventColumn = React.memo((props: EventColumnProps) => {
  const {
    column,
    columnIndex,
    disableColumnOptions,
    pagingEnabled,
    subscriptions,
    appViewMode,
  } = props

  const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

  return (
    <EventOrNotificationColumn
      key={`event-column-${column.id}-inner`}
      column={column}
      columnIndex={columnIndex}
      disableColumnOptions={disableColumnOptions}
      owner={requestTypeIconAndData.owner}
      pagingEnabled={pagingEnabled}
      repo={requestTypeIconAndData.repo}
      repoIsKnown={requestTypeIconAndData.repoIsKnown}
      subscriptions={subscriptions}
      appViewMode={appViewMode}
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
