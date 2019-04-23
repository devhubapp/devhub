import React from 'react'

import { GitHubNotificationReason } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../../../../libs/platform'
import { getNotificationReasonMetadata } from '../../../../../utils/helpers/github/notifications'
import { SpringAnimatedText } from '../../../../animated/spring/SpringAnimatedText'
import { getCardStylesForTheme } from '../../../styles'

export interface NotificationReasonProps {
  reason: GitHubNotificationReason
}

export function NotificationReason(props: NotificationReasonProps) {
  const { reason } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const reasonDetails = getNotificationReasonMetadata(
    reason,
    springAnimatedTheme,
  )

  if (!(reasonDetails && reasonDetails.label)) return null

  return (
    <SpringAnimatedText
      numberOfLines={1}
      style={[
        getCardStylesForTheme(springAnimatedTheme).headerActionText,
        {
          color: reasonDetails.color,
        },
      ]}
      {...Platform.select({
        web: {
          title: reasonDetails.fullDescription,
        },
      })}
    >
      {reasonDetails.label.toLowerCase()}
    </SpringAnimatedText>
  )
}
