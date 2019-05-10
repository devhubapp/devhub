import React from 'react'

import { SwipeableRow } from '../../libs/swipeable'
import { useTheme } from '../context/ThemeContext'
import { NotificationCard, NotificationCardProps } from './NotificationCard'

export interface SwipeableNotificationCardProps extends NotificationCardProps {}

export function SwipeableNotificationCard(
  props: SwipeableNotificationCardProps,
) {
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
          icon: 'mail-read',
          key: 'read',
          label: 'Read',
          onPress: handleMarkAsRead,
          type: 'FULL',
        },
      ]}
      rightActions={[
        {
          color: theme.orange,
          icon: 'clock',
          key: 'snooze',
          label: 'Snooze',
          onPress: handleSnooze,
        },
        {
          color: theme.foregroundColorMuted50,
          icon: 'archive',
          key: 'archive',
          label: 'Archive',
          onPress: handleArchive,
        },
      ]}
    >
      <NotificationCard {...props} />
    </SwipeableRow>
  )
}
