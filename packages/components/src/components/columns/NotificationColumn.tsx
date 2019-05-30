import React from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  NotificationCardsContainer,
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import { ColumnRenderer } from './ColumnRenderer'

export interface NotificationColumnProps
  extends Omit<
    NotificationCardsContainerProps,
    'cardViewMode' | 'enableCompactLabels' | 'repoIsKnown'
  > {
  columnIndex: number
  disableColumnOptions?: boolean
  headerDetails: ReturnType<typeof getColumnHeaderDetails>
  pagingEnabled?: boolean
}

export const NotificationColumn = React.memo(
  (props: NotificationColumnProps) => {
    const {
      column,
      columnIndex,
      disableColumnOptions,
      headerDetails,
      pagingEnabled,
    } = props

    if (!headerDetails) return null

    return (
      <ColumnRenderer
        key={`notification-column-${column.id}-inner`}
        avatarRepo={headerDetails.avatarProps && headerDetails.avatarProps.repo}
        avatarUsername={
          headerDetails.avatarProps && headerDetails.avatarProps.username
        }
        column={column}
        disableColumnOptions={disableColumnOptions}
        icon={headerDetails.icon}
        owner={headerDetails.owner}
        pagingEnabled={pagingEnabled}
        repo={headerDetails.repo}
        repoIsKnown={headerDetails.repoIsKnown}
        subtitle={headerDetails.subtitle}
        title={headerDetails.title}
      >
        {({ cardViewMode, enableCompactLabels }) => (
          <NotificationCardsContainer
            {...props}
            key={`notification-cards-container-${column.id}`}
            cardViewMode={cardViewMode}
            columnIndex={columnIndex}
            enableCompactLabels={enableCompactLabels}
            repoIsKnown={headerDetails.repoIsKnown}
          />
        )}
      </ColumnRenderer>
    )
  },
)
