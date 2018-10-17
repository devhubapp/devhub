import React, { PureComponent } from 'react'

import { SwipeableRow } from '../../libs/swipeable'
import * as colors from '../../styles/colors'
import { ThemeConsumer } from '../context/ThemeContext'
import { NotificationCard, NotificationCardProps } from './NotificationCard'

export interface SwipeableNotificationCardProps extends NotificationCardProps {}

export interface SwipeableNotificationCardState {}

export class SwipeableNotificationCard extends PureComponent<
  SwipeableNotificationCardProps,
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
      <ThemeConsumer>
        {({ theme }) => (
          <SwipeableRow
            leftActions={[
              {
                color: colors.blue,
                icon: 'isRead',
                key: 'isRead',
                label: 'Read',
                onPress: this.handleMarkAsRead,
                type: 'FULL',
              },
            ]}
            rightActions={[
              {
                color: colors.orange,
                icon: 'snooze',
                key: 'snooze',
                label: 'Snooze',
                onPress: this.handleSnooze,
              },
              {
                color: theme.foregroundColorMuted50,
                icon: 'archive',
                key: 'archive',
                label: 'Archive',
                onPress: this.handleArchive,
              },
            ]}
          >
            <NotificationCard {...this.props} />
          </SwipeableRow>
        )}
      </ThemeConsumer>
    )
  }
}
