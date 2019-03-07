import React from 'react'

import { AppViewMode, getColumnHeaderDetails } from '@devhub/core'
import {
  NotificationCardsContainer,
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import { EventOrNotificationColumn } from './EventOrNotificationColumn'

export interface NotificationColumnProps
  extends NotificationCardsContainerProps {
  columnIndex: number
  disableColumnOptions?: boolean
  pagingEnabled?: boolean
  appViewMode: AppViewMode
}

export const NotificationColumn = React.memo(
  (props: NotificationColumnProps) => {
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
        key={`notification-column-${column.id}-inner`}
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
        <NotificationCardsContainer
          key={`notification-cards-container-${column.id}`}
          cardViewMode={
            appViewMode === 'single-column' ? 'compact' : 'expanded'
          }
          repoIsKnown={requestTypeIconAndData.repoIsKnown}
          {...props}
          columnIndex={columnIndex}
        />
      </EventOrNotificationColumn>
    )
  },
)
