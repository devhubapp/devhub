import React, { useMemo } from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import { IconProp } from '../../libs/vector-icons'
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
        pointerEvents={pointerEvents}
        swipeable={swipeable}
      />
    ),
    [columnId, columnIndex, pointerEvents, swipeable],
  )

  if (!headerDetails) return null

  return (
    <ColumnRenderer
      key={`event-column-${columnId}-inner`}
      avatarImageURL={
        headerDetails.avatarProps && headerDetails.avatarProps.imageURL
      }
      avatarLinkURL={
        headerDetails.avatarProps && headerDetails.avatarProps.linkURL
      }
      columnId={columnId}
      columnType="activity"
      columnIndex={columnIndex}
      icon={headerDetails.icon as IconProp}
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
