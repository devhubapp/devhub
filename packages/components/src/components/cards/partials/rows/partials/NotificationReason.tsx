import React from 'react'

import { GitHubNotificationReason } from '@devhub/core'
import { Platform } from '../../../../../libs/platform'
import { getNotificationReasonMetadata } from '../../../../../utils/helpers/github/notifications'
import { ThemedText } from '../../../../themed/ThemedText'
import { cardStyles } from '../../../styles'

export interface NotificationReasonProps {
  reason: GitHubNotificationReason
}

export function NotificationReason(props: NotificationReasonProps) {
  const { reason } = props

  const reasonDetails = getNotificationReasonMetadata(reason)

  if (!(reasonDetails && reasonDetails.label)) return null

  return (
    <ThemedText
      color={reasonDetails.color || 'foregroundColor'}
      numberOfLines={1}
      style={cardStyles.headerActionText}
      {...Platform.select({
        web: {
          title: reasonDetails.fullDescription,
        },
      })}
    >
      {reasonDetails.label.toLowerCase()}
    </ThemedText>
  )
}
