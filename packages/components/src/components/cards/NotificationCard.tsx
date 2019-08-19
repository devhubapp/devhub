import React, { useEffect, useMemo, useRef } from 'react'
import { View } from 'react-native'

import { EnhancedGitHubNotification } from '@devhub/core'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { tryFocus } from '../../utils/helpers/shared'
import { BaseCard } from './BaseCard'
import { BaseCardProps, getCardPropsForItem } from './BaseCard.shared'
import { CardBorder } from './partials/CardBorder'

export interface NotificationCardProps {
  cachedCardProps?: BaseCardProps | undefined
  isFocused: boolean
  notification: EnhancedGitHubNotification
  ownerIsKnown: boolean
  repoIsKnown: boolean
  swipeable: boolean
}

export const NotificationCard = React.memo((props: NotificationCardProps) => {
  const {
    cachedCardProps,
    isFocused,
    notification,
    ownerIsKnown,
    repoIsKnown,
  } = props

  const ref = useRef<View>(null)

  useEffect(() => {
    if (!(Platform.OS === 'web' && ref.current)) return
    if (isFocused) tryFocus(ref.current)
  }, [isFocused])

  const CardComponent = useMemo(
    () => (
      <BaseCard
        key={`notifications-base-card-${notification.id}`}
        {...cachedCardProps ||
          getCardPropsForItem('notifications', notification, {
            ownerIsKnown,
            repoIsKnown,
          })}
      />
    ),
    [cachedCardProps, notification, ownerIsKnown, repoIsKnown],
  )

  return (
    <View ref={ref} style={sharedStyles.relative}>
      {CardComponent}
      {!!(!Platform.supportsTouch && isFocused) && <CardBorder />}
    </View>
  )
})

NotificationCard.displayName = 'NotificationCard'
