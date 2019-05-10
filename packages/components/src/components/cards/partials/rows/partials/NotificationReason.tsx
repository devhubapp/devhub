import React from 'react'

import {
  getNotificationReasonMetadata,
  GitHubNotificationReason,
  ThemeColors,
} from '@devhub/core'
import { Label } from '../../../../common/Label'

export interface NotificationReasonProps {
  backgroundThemeColor: keyof ThemeColors | ((theme: ThemeColors) => string)
  muted: boolean
  reason: GitHubNotificationReason
}

export function NotificationReason(props: NotificationReasonProps) {
  const { backgroundThemeColor, muted, reason } = props

  const reasonDetails = getNotificationReasonMetadata(reason)

  if (!(reasonDetails && reasonDetails.label)) return null

  return (
    <Label
      backgroundThemeColor={backgroundThemeColor}
      colorThemeColor={reasonDetails.color}
      muted={muted}
      outline={false}
      small
      textThemeColor="foregroundColorMuted60"
    >
      {reasonDetails.label.toLowerCase()}
    </Label>
  )
}
