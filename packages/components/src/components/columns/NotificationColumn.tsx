import React from 'react'

import { getColumnHeaderDetails, Omit } from '@devhub/core'
import {
  NotificationCardsContainer,
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import { ColumnRenderer } from './ColumnRenderer'

export interface NotificationColumnProps
  extends Omit<NotificationCardsContainerProps, 'repoIsKnown'> {
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

    return (
      <ColumnRenderer
        key={`notification-column-${column.id}-inner`}
        avatarRepo={headerDetails.avatarProps && headerDetails.avatarProps.repo}
        avatarUsername={
          headerDetails.avatarProps && headerDetails.avatarProps.username
        }
        column={column}
        columnIndex={columnIndex}
        disableColumnOptions={disableColumnOptions}
        icon={headerDetails.icon}
        owner={headerDetails.owner}
        pagingEnabled={pagingEnabled}
        repo={headerDetails.repo}
        repoIsKnown={headerDetails.repoIsKnown}
        subtitle={headerDetails.subtitle}
        title={headerDetails.title}
      >
        <NotificationCardsContainer
          key={`notification-cards-container-${column.id}`}
          repoIsKnown={headerDetails.repoIsKnown}
          {...props}
          columnIndex={columnIndex}
        />
      </ColumnRenderer>
    )
  },
)
