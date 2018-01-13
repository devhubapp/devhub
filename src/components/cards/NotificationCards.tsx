import React from 'react'
import { FlatList } from 'react-native'

import theme from '../../styles/themes/dark'
import { contentPadding } from '../../styles/variables'
import { IGitHubNotification } from '../../types'
import TransparentTextOverlay from '../common/TransparentTextOverlay'
import NotificationCard from './NotificationCard'
import CardItemSeparator from './partials/CardItemSeparator'

export interface IProps {
  notifications: IGitHubNotification[]
}

class NotificationCards extends React.PureComponent<IProps> {
  keyExtractor(notification: IGitHubNotification) {
    return `${notification.id}`
  }

  renderItem({ item: notification }: { item: IGitHubNotification }) {
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

export default NotificationCards
