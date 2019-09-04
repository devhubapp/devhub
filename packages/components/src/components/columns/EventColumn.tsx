import React, { useMemo } from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import { ColumnRenderer, ColumnRendererProps } from './ColumnRenderer'

export interface EventColumnProps
  extends Omit<EventCardsContainerProps, 'ownerIsKnown' | 'repoIsKnown'> {
  columnIndex: number
  headerDetails: ReturnType<typeof getColumnHeaderDetails>
  pagingEnabled?: boolean
}

export const EventColumn = React.memo((props: EventColumnProps) => {
  const {
    columnId,
    columnIndex,
    headerDetails,
    pagingEnabled,
    pointerEvents,
    swipeable,
  } = props

  const Children = useMemo<ColumnRendererProps['children']>(
    () => (
      <EventCardsContainer
        key={`event-cards-container-${columnId}`}
        columnId={columnId}
        columnIndex={columnIndex}
        ownerIsKnown={!!(headerDetails && headerDetails.ownerIsKnown)}
        pointerEvents={pointerEvents}
        repoIsKnown={!!(headerDetails && headerDetails.repoIsKnown)}
        swipeable={swipeable}
      />
    ),
    [
      columnId,
      pointerEvents,
      swipeable,
      headerDetails && headerDetails.ownerIsKnown,
      headerDetails && headerDetails.repoIsKnown,
    ],
  )

  if (!headerDetails) return null

  return (
    <ColumnRenderer
      key={`event-column-${columnId}-inner`}
      avatarRepo={headerDetails.avatarProps && headerDetails.avatarProps.repo}
      avatarUsername={
        headerDetails.avatarProps && headerDetails.avatarProps.username
      }
      columnId={columnId}
      columnType="activity"
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
