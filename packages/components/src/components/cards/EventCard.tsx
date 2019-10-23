import React from 'react'

import { CardWithLink } from './CardWithLink'

export interface EventCardProps {
  columnId: string
  nodeIdOrId: string
  ownerIsKnown: boolean
  repoIsKnown: boolean
}

export const EventCard = React.memo((props: EventCardProps) => {
  const { columnId, nodeIdOrId, ownerIsKnown, repoIsKnown } = props

  return (
    <CardWithLink
      type="activity"
      repoIsKnown={repoIsKnown}
      ownerIsKnown={ownerIsKnown}
      nodeIdOrId={nodeIdOrId}
      columnId={columnId}
    />
  )
})

EventCard.displayName = 'EventCard'
