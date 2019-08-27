import React, { useEffect, useMemo, useRef } from 'react'
import { View } from 'react-native'

import { EnhancedGitHubEvent } from '@devhub/core'
import { useIsItemFocused } from '../../hooks/use-is-item-focused'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { tryFocus } from '../../utils/helpers/shared'
import { BaseCard } from './BaseCard'
import { BaseCardProps, getCardPropsForItem } from './BaseCard.shared'
import { CardBorder } from './partials/CardBorder'

export interface EventCardProps {
  cachedCardProps?: BaseCardProps | undefined
  columnId: string
  event: EnhancedGitHubEvent
  ownerIsKnown: boolean
  repoIsKnown: boolean
  swipeable: boolean
}

export const EventCard = React.memo((props: EventCardProps) => {
  const { cachedCardProps, columnId, event, ownerIsKnown, repoIsKnown } = props

  const ref = useRef<View>(null)

  const isFocused = useIsItemFocused(columnId, event.id)

  useEffect(() => {
    if (!(Platform.OS === 'web' && ref.current)) return
    if (isFocused) tryFocus(ref.current)
  }, [isFocused])

  const CardComponent = useMemo(
    () => (
      <BaseCard
        key={`activity-base-card-${event.id}`}
        {...cachedCardProps ||
          getCardPropsForItem('activity', event, {
            ownerIsKnown,
            repoIsKnown,
          })}
      />
    ),
    [cachedCardProps, event, ownerIsKnown, repoIsKnown],
  )

  return (
    <View ref={ref} style={sharedStyles.relative}>
      {CardComponent}
      {!!(!Platform.supportsTouch && isFocused) && <CardBorder />}
    </View>
  )
})

EventCard.displayName = 'EventCard'
