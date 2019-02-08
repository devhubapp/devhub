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

export const NotificationColumn = React.memo(
  (props: NotificationColumnProps) => {
    const { column, columnIndex, pagingEnabled, subscriptions } = props

    const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

    return (
      <EventOrNotificationColumn
        key={`notification-column-${column.id}-inner`}
        column={column}
        columnIndex={columnIndex}
        owner={requestTypeIconAndData.owner}
        pagingEnabled={pagingEnabled}
        repo={requestTypeIconAndData.repo}
        repoIsKnown={requestTypeIconAndData.repoIsKnown}
        subscriptions={subscriptions}
      >
        <NotificationCardsContainer
          key={`notification-cards-container-${column.id}`}
          repoIsKnown={requestTypeIconAndData.repoIsKnown}
          {...props}
          columnIndex={columnIndex}
        />
      </EventOrNotificationColumn>
    )
  },
)
