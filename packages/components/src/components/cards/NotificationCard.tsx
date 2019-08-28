import React, { useEffect, useMemo, useRef } from 'react'
import { View } from 'react-native'

import { EnhancedGitHubNotification } from '@devhub/core'
import { useIsItemFocused } from '../../hooks/use-is-item-focused'
import { usePrevious } from '../../hooks/use-previous'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { tryFocus } from '../../utils/helpers/shared'
import { BaseCard } from './BaseCard'
import { BaseCardProps, getCardPropsForItem } from './BaseCard.shared'
import { CardFocusIndicator } from './partials/CardFocusIndicator'
import { CardSavedIndicator } from './partials/CardSavedIndicator'

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
  } = props

  const ref = useRef<View>(null)

  const isFocused = useIsItemFocused(columnId, notification.id)
  const wasFocused = usePrevious(isFocused)

  useEffect(() => {
    if (!(Platform.OS === 'web' && ref.current)) return
    if (isFocused && !wasFocused) tryFocus(ref.current)
  }, [isFocused && !wasFocused])

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
      {!!(!Platform.supportsTouch && isFocused) && <CardFocusIndicator />}
      {!!notification.saved && <CardSavedIndicator />}
    </View>
  )
})

NotificationCard.displayName = 'NotificationCard'
