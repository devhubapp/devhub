import React from 'react'

import { CardWithLink } from './CardWithLink'

export interface NotificationCardProps {
  columnId: string
  nodeIdOrId: string
  ownerIsKnown: boolean
  repoIsKnown: boolean
}

export const NotificationCard = React.memo((props: NotificationCardProps) => {
  const { columnId, nodeIdOrId, ownerIsKnown, repoIsKnown } = props

  return (
    <CardWithLink
      type="notifications"
      repoIsKnown={repoIsKnown}
      ownerIsKnown={ownerIsKnown}
      nodeIdOrId={nodeIdOrId}
      columnId={columnId}
    />
  )
})

NotificationCard.displayName = 'NotificationCard'
