import React from 'react'

import { EnhancedGitHubEvent } from '@devhub/core'
import { BaseCardProps } from './BaseCard.shared'
import { CardWithLink } from './CardWithLink'

export interface EventCardProps {
  cachedCardProps?: BaseCardProps | undefined
  columnId: string
  event: EnhancedGitHubEvent
  ownerIsKnown: boolean
  repoIsKnown: boolean
  swipeable: boolean
}

export const EventCard = React.memo((props: EventCardProps) => {
  const {
    cachedCardProps,
    columnId,
    event,
    ownerIsKnown,
    repoIsKnown,
    swipeable,
  } = props

  return (
    <CardWithLink
      type="activity"
      swipeable={swipeable}
      repoIsKnown={repoIsKnown}
      ownerIsKnown={ownerIsKnown}
      item={event}
      columnId={columnId}
      cachedCardProps={cachedCardProps}
    />
  )
})

EventCard.displayName = 'EventCard'
