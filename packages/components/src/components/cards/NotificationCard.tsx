import React from 'react'

import { EnhancedGitHubNotification } from '@devhub/core'
import { CardWithLink } from './CardWithLink'

export interface NotificationCardProps {
  columnId: string
  notification: EnhancedGitHubNotification
  ownerIsKnown: boolean
  repoIsKnown: boolean
}

export const NotificationCard = React.memo((props: NotificationCardProps) => {
  const { columnId, notification, ownerIsKnown, repoIsKnown } = props

  return (
    <CardWithLink
      type="notifications"
      repoIsKnown={repoIsKnown}
      ownerIsKnown={ownerIsKnown}
      item={notification}
      columnId={columnId}
    />
  )
})

NotificationCard.displayName = 'NotificationCard'
