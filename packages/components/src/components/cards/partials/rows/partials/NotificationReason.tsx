import React from 'react'

import { GitHubNotificationReason } from '@devhub/core'
import { Platform } from '../../../../../libs/platform'
import { mutedOpacity, smallerTextSize } from '../../../../../styles/variables'
import { getNotificationReasonMetadata } from '../../../../../utils/helpers/github/notifications'
import { ThemedText } from '../../../../themed/ThemedText'

export interface NotificationReasonProps {
  muted?: boolean
  reason: GitHubNotificationReason
}

export function NotificationReason(props: NotificationReasonProps) {
  const { muted, reason } = props

  const reasonDetails = getNotificationReasonMetadata(reason)

  if (!(reasonDetails && reasonDetails.label)) return null

  return (
    <ThemedText
      color={reasonDetails.color || 'foregroundColorMuted50'}
      numberOfLines={1}
      style={{
        fontSize: smallerTextSize,
        fontStyle: 'italic',
        opacity: muted ? mutedOpacity : 1,
      }}
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
