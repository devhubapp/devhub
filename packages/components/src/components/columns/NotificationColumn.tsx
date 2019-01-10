import React from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  NotificationCardsContainer,
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import { EventOrNotificationColumn } from './EventOrNotificationColumn'

export interface NotificationColumnProps
  extends NotificationCardsContainerProps {
  columnIndex: number
  pagingEnabled?: boolean
}

export function NotificationColumn(props: NotificationColumnProps) {
  const { column, columnIndex, pagingEnabled, subscriptions } = props

  const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

  return (
    <EventOrNotificationColumn
      key={`notification-column-${column.id}-inner`}
      column={column}
      subscriptions={subscriptions}
      columnIndex={columnIndex}
      pagingEnabled={pagingEnabled}
    >
      <NotificationCardsContainer
        key={`notification-cards-container-${column.id}`}
        repoIsKnown={requestTypeIconAndData.repoIsKnown}
        {...props}
        columnIndex={columnIndex}
      />
    </EventOrNotificationColumn>
  )
}
