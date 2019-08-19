import React from 'react'

import { SwipeableRow } from '../../libs/swipeable'
import { useTheme } from '../context/ThemeContext'
import { EventCard, EventCardProps } from './EventCard'

export interface SwipeableEventCardProps extends EventCardProps {}

export function SwipeableEventCard(props: SwipeableEventCardProps) {
  const theme = useTheme()

  function handleArchive() {
    // alert('Archive')
  }

  function handleMarkAsRead() {
    // alert('Mark as read')
  }

  function handleSnooze() {
    // alert('Snooze')
  }

  return (
    <SwipeableRow
      leftActions={[
        {
          color: theme.blue,
          icon: 'done',
          key: 'read',
          label: 'Read',
          onPress: handleMarkAsRead,
          type: 'FULL',
        },
      ]}
      rightActions={[
        {
          color: theme.orange,
          icon: 'snooze',
          key: 'snooze',
          label: 'Snooze',
          onPress: handleSnooze,
        },
        {
          color: theme.foregroundColorMuted65,
          icon: 'archive',
          key: 'archive',
          label: 'Archive',
          onPress: handleArchive,
        },
      ]}
    >
      <EventCard {...props} />
    </SwipeableRow>
  )
}
