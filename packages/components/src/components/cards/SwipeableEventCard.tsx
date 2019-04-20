import React from 'react'

import { SwipeableRow } from '../../libs/swipeable'
import { useTheme } from '../context/ThemeContext'
import { EventCard, EventCardProps } from './EventCard'

export interface SwipeableEventCardProps extends EventCardProps {}

export function SwipeableEventCard(props: SwipeableEventCardProps) {
  const theme = useTheme()

  function onArchive() {
    // alert('Archive')
  }

  function onMarkAsRead() {
    // alert('Mark as read')
  }

  return (
    <SwipeableRow
      leftActions={[
        {
          color: theme.blue,
          icon: 'isRead',
          key: 'isRead',
          label: 'Read',
          onPress: onMarkAsRead,
          type: 'FULL',
        },
      ]}
      rightActions={[
        {
          color: theme.backgroundColorMore1,
          icon: 'archive',
          key: 'archive',
          label: 'Archive',
          onPress: onArchive,
          type: 'FULL',
        },
      ]}
    >
      <EventCard {...props} />
    </SwipeableRow>
  )
}
