import React from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import { ColumnRenderer } from './ColumnRenderer'

export interface EventColumnProps
  extends Omit<
    EventCardsContainerProps,
    'cardViewMode' | 'disableItemFocus' | 'enableCompactLabels' | 'repoIsKnown'
  > {
  columnIndex: number
  disableColumnOptions?: boolean
  headerDetails: ReturnType<typeof getColumnHeaderDetails>
  pagingEnabled?: boolean
}

export const EventColumn = React.memo((props: EventColumnProps) => {
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
      key={`event-column-${column.id}-inner`}
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
      {({ cardViewMode, enableCompactLabels, disableItemFocus }) => (
        <EventCardsContainer
          {...props}
          key={`event-cards-container-${column.id}`}
          cardViewMode={cardViewMode}
          columnIndex={columnIndex}
          enableCompactLabels={enableCompactLabels}
          disableItemFocus={disableItemFocus}
          repoIsKnown={headerDetails.repoIsKnown}
        />
      )}
    </ColumnRenderer>
  )
})
