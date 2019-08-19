import React, { useEffect, useMemo, useRef } from 'react'
import { View } from 'react-native'

import { EnhancedGitHubEvent } from '@devhub/core'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { tryFocus } from '../../utils/helpers/shared'
import { BaseCard } from './BaseCard'
import { BaseCardProps, getCardPropsForItem } from './BaseCard.shared'
import { CardBorder } from './partials/CardBorder'

export interface EventCardProps {
  cachedCardProps?: BaseCardProps | undefined
  event: EnhancedGitHubEvent
  isFocused?: boolean
  ownerIsKnown: boolean
  repoIsKnown: boolean
  swipeable: boolean
}

export const EventCard = React.memo((props: EventCardProps) => {
  const { cachedCardProps, event, isFocused, ownerIsKnown, repoIsKnown } = props

  const ref = useRef<View>(null)

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
