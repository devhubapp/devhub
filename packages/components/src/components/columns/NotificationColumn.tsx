import React, { useMemo } from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  NotificationCardsContainer,
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import { ColumnRenderer, ColumnRendererProps } from './ColumnRenderer'

export interface NotificationColumnProps
  extends Omit<
    NotificationCardsContainerProps,
    'disableItemFocus' | 'repoIsKnown'
  > {
  columnIndex: number
  headerDetails: ReturnType<typeof getColumnHeaderDetails>
  pagingEnabled?: boolean
}

export const NotificationColumn = React.memo(
  (props: NotificationColumnProps) => {
    const {
      column,
      columnIndex,
      headerDetails,
      pagingEnabled,
      pointerEvents,
      swipeable,
    } = props

    const Children = useMemo<ColumnRendererProps['children']>(
      () => ({ disableItemFocus }) => (
        <NotificationCardsContainer
          key={`notification-cards-container-${column.id}`}
          column={column}
          columnIndex={columnIndex}
          disableItemFocus={disableItemFocus}
          pointerEvents={pointerEvents}
          swipeable={swipeable}
          repoIsKnown={!!(headerDetails && headerDetails.repoIsKnown)}
        />
      ),
      [
        column,
        columnIndex,
        pointerEvents,
        swipeable,
        headerDetails && headerDetails.repoIsKnown,
      ],
    )

    if (!headerDetails) return null

    return (
      <ColumnRenderer
        key={`notification-column-${column.id}-inner`}
        avatarRepo={headerDetails.avatarProps && headerDetails.avatarProps.repo}
        avatarUsername={
          headerDetails.avatarProps && headerDetails.avatarProps.username
        }
        column={column}
        columnIndex={columnIndex}
        icon={headerDetails.icon}
        owner={headerDetails.owner}
        pagingEnabled={pagingEnabled}
        repo={headerDetails.repo}
        repoIsKnown={headerDetails.repoIsKnown}
        subtitle={headerDetails.subtitle}
        title={headerDetails.title}
      >
        {Children}
      </ColumnRenderer>
    )
  },
)

NotificationColumn.displayName = 'NotificationColumn'
