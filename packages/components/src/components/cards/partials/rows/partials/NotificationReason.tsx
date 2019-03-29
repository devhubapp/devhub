import React from 'react'

import { GitHubNotificationReason, ThemeColors } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../../hooks/use-css-variables-or-spring--animated-theme'
import { getReadableColor } from '../../../../../utils/helpers/colors'
import { getNotificationReasonMetadata } from '../../../../../utils/helpers/github/notifications'
import { SpringAnimatedIcon } from '../../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../../animated/spring/SpringAnimatedText'
import { useTheme } from '../../../../context/ThemeContext'
import { getCardStylesForTheme } from '../../../styles'

export interface NotificationReasonProps {
  backgroundThemeColor: keyof ThemeColors
  isPrivate?: boolean
  reason: GitHubNotificationReason
}

export function NotificationReason(props: NotificationReasonProps) {
  const { backgroundThemeColor, isPrivate, reason } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
  const theme = useTheme()

  const reasonDetails = getNotificationReasonMetadata(reason)

  if (!(reasonDetails && reasonDetails.label)) return null

  return (
    <SpringAnimatedText
      numberOfLines={1}
      style={[
        getCardStylesForTheme(springAnimatedTheme).descriptionText,
        {
          color: getReadableColor(
            reasonDetails.color,
            theme[backgroundThemeColor],
            0.3,
          ),
        },
      ]}
    >
      {!!isPrivate && (
        <>
          <SpringAnimatedIcon name="lock" />{' '}
        </>
      )}
      {reasonDetails.label.toLowerCase()}
    </SpringAnimatedText>
  )
}
