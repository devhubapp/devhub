import React, { PureComponent } from 'react'

import SwipeableRow from '../../libs/swipeable'
import theme from '../../styles/themes/dark'
import NotificationCard, {
  NotificationCardProperties,
} from './NotificationCard'

export interface SwipeableNotificationCardProperties
  extends NotificationCardProperties {}

export interface SwipeableNotificationCardState {}

export default class SwipeableNotificationCard extends PureComponent<
  SwipeableNotificationCardProperties,
  SwipeableNotificationCardState
> {
  handleArchive = () => {
    // alert('Archive')
  }

  handleMarkAsRead = () => {
    // alert('Mark as read')
  }

  handleSnooze = () => {
    // alert('Snooze')
  }

  render() {
    return (
      <SwipeableRow
        leftActions={[
          {
            color: theme.blue,
            icon: 'isRead',
            key: 'isRead',
            label: 'Read',
            onPress: this.handleMarkAsRead,
            type: 'FULL',
          },
        ]}
        rightActions={[
          {
            color: theme.orange,
            icon: 'snooze',
            key: 'snooze',
            label: 'Snooze',
            onPress: this.handleSnooze,
          },
          {
            color: theme.base01,
            icon: 'archive',
            key: 'archive',
            label: 'Archive',
            onPress: this.handleArchive,
          },
        ]}
      >
        <NotificationCard {...this.props} />
      </SwipeableRow>
    )
  }
}
