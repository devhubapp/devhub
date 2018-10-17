import { ActivityGetNotificationsResponseItem } from '@octokit/rest'
import React, { PureComponent } from 'react'

import { FlatList } from '../../libs/lists'
import { contentPadding } from '../../styles/variables'
import { TransparentTextOverlay } from '../common/TransparentTextOverlay'
import { ThemeConsumer } from '../context/ThemeContext'
import { NotificationCard } from './NotificationCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableNotificationCard } from './SwipeableNotificationCard'

export interface NotificationCardsProps {
  notifications: ActivityGetNotificationsResponseItem[]
  swipeable?: boolean
}

export interface NotificationCardsState {}

export class NotificationCards extends PureComponent<
  NotificationCardsProps,
  NotificationCardsState
> {
  keyExtractor(notification: ActivityGetNotificationsResponseItem) {
    return `notification-card-${notification.id}`
  }

  renderItem = ({
    item: notification,
  }: {
    item: ActivityGetNotificationsResponseItem
  }) => {
    if (this.props.swipeable) {
      return <SwipeableNotificationCard notification={notification} />
    }

    return <NotificationCard notification={notification} />
  }

  render() {
    const { notifications } = this.props
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <TransparentTextOverlay
            color={theme.backgroundColor}
            size={contentPadding}
            from="vertical"
          >
            <FlatList
              key="notification-cards-flat-list"
              data={notifications}
              ItemSeparatorComponent={CardItemSeparator}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />
          </TransparentTextOverlay>
        )}
      </ThemeConsumer>
    )
  }
}
