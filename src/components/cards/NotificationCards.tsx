import React, { PureComponent } from 'react'

import { FlatList } from '../../libs/lists'
import theme from '../../styles/themes/dark'
import { contentPadding } from '../../styles/variables'
import { IGitHubNotification } from '../../types'
import TransparentTextOverlay from '../common/TransparentTextOverlay'
import NotificationCard from './NotificationCard'
import CardItemSeparator from './partials/CardItemSeparator'
import SwipeableNotificationCard from './SwipeableNotificationCard'

export interface NotificationCardsProps {
  notifications: IGitHubNotification[]
  swipeable?: boolean
}

export interface NotificationCardsState {}

export default class NotificationCards extends PureComponent<
  NotificationCardsProps,
  NotificationCardsState
> {
  keyExtractor(notification: IGitHubNotification) {
    return `${notification.id}`
  }

  renderItem = ({ item: notification }: { item: IGitHubNotification }) => {
    if (this.props.swipeable) {
      return (
        <SwipeableNotificationCard
          key={`notification-card-${notification.id}`}
          notification={notification}
        />
      )
    }

    return (
      <NotificationCard
        key={`notification-card-${notification.id}`}
        notification={notification}
      />
    )
  }

  render() {
    const { notifications } = this.props
    return (
      <TransparentTextOverlay
        color={theme.base02}
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
    )
  }
}
