import React from 'react'

import { SwipeableRow } from '../../libs/swipeable'
import { useTheme } from '../context/ThemeContext'
import {
  IssueOrPullRequestCard,
  IssueOrPullRequestCardProps,
} from './IssueOrPullRequestCard'

export interface SwipeableIssueOrPullRequestCardProps
  extends IssueOrPullRequestCardProps {}

export function SwipeableIssueOrPullRequestCard(
  props: SwipeableIssueOrPullRequestCardProps,
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
          color: theme.foregroundColorMuted65,
          icon: 'archive',
          key: 'archive',
          label: 'Archive',
          onPress: handleArchive,
        },
      ]}
    >
      <IssueOrPullRequestCard {...props} />
    </SwipeableRow>
  )
}
