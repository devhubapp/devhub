import React from 'react'

import { EnhancedGitHubEvent } from '@devhub/core'
import { CardWithLink } from './CardWithLink'

export interface EventCardProps {
  columnId: string
  event: EnhancedGitHubEvent
  ownerIsKnown: boolean
  repoIsKnown: boolean
}

export const EventCard = React.memo((props: EventCardProps) => {
  const { columnId, event, ownerIsKnown, repoIsKnown } = props

  return (
    <CardWithLink
      type="activity"
      repoIsKnown={repoIsKnown}
      ownerIsKnown={ownerIsKnown}
      item={event}
      columnId={columnId}
    />
  )
})

EventCard.displayName = 'EventCard'
