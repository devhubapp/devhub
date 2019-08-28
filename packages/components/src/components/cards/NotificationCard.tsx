import React from 'react'

import { EnhancedGitHubNotification } from '@devhub/core'
import { BaseCardProps } from './BaseCard.shared'
import { CardWithLink } from './CardWithLink'

export interface NotificationCardProps {
  cachedCardProps?: BaseCardProps | undefined
  columnId: string
  notification: EnhancedGitHubNotification
  ownerIsKnown: boolean
  repoIsKnown: boolean
  swipeable: boolean
}

export const NotificationCard = React.memo((props: NotificationCardProps) => {
  const {
    cachedCardProps,
    columnId,
    notification,
    ownerIsKnown,
    repoIsKnown,
    swipeable,
  } = props

  return (
    <CardWithLink
      type="notifications"
      swipeable={swipeable}
      repoIsKnown={repoIsKnown}
      ownerIsKnown={ownerIsKnown}
      item={notification}
      columnId={columnId}
      cachedCardProps={cachedCardProps}
    />
  )
})

NotificationCard.displayName = 'NotificationCard'
