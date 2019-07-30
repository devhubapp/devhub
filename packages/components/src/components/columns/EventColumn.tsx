import React, { useMemo } from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import { ColumnRenderer, ColumnRendererProps } from './ColumnRenderer'

export interface EventColumnProps
  extends Omit<
    EventCardsContainerProps,
    'cardViewMode' | 'disableItemFocus' | 'enableCompactLabels' | 'repoIsKnown'
  > {
  columnIndex: number
  headerDetails: ReturnType<typeof getColumnHeaderDetails>
  pagingEnabled?: boolean
}

export const EventColumn = React.memo((props: EventColumnProps) => {
  const {
    column,
    columnIndex,
    headerDetails,
    pagingEnabled,
    pointerEvents,
    swipeable,
  } = props

  const Children = useMemo<ColumnRendererProps['children']>(
    () => ({ cardViewMode, enableCompactLabels, disableItemFocus }) => (
      <EventCardsContainer
        key={`event-cards-container-${column.id}`}
        cardViewMode={cardViewMode}
        column={column}
        columnIndex={columnIndex}
        disableItemFocus={disableItemFocus}
        enableCompactLabels={enableCompactLabels}
        pointerEvents={pointerEvents}
        repoIsKnown={!!(headerDetails && headerDetails.repoIsKnown)}
        swipeable={swipeable}
      />
    ),
    [
      column,
      pointerEvents,
      swipeable,
      headerDetails && headerDetails.repoIsKnown,
    ],
  )

  if (!headerDetails) return null

  return (
    <ColumnRenderer
      key={`event-column-${column.id}-inner`}
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
})

EventColumn.displayName = 'EventColumn'
