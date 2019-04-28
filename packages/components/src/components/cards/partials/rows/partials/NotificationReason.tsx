import React from 'react'

import {
  getNotificationReasonMetadata,
  GitHubNotificationReason,
  ThemeColors,
} from '@devhub/core'
import { Label } from '../../../../common/Label'

export interface NotificationReasonProps {
  backgroundThemeColor: keyof ThemeColors | ((theme: ThemeColors) => string)
  muted?: boolean
  reason: GitHubNotificationReason
}

export function NotificationReason(props: NotificationReasonProps) {
  const { backgroundThemeColor, reason } = props

  const reasonDetails = getNotificationReasonMetadata(reason)

  if (!(reasonDetails && reasonDetails.label)) return null

  return (
    <Label
      backgroundThemeColor={backgroundThemeColor}
      colorThemeColor={reasonDetails.color}
      containerStyle={{ alignSelf: 'center' }}
      outline={false}
      small
    >
      {reasonDetails.label.toLowerCase()}
    </Label>
  )
}
