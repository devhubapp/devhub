import React from 'react'
import { FlatList } from 'react-native'

import { INotification } from '../../utils/types'
import NotificationCard from './NotificationCard'
import CardItemSeparator from './partials/CardItemSeparator'

export interface IProps {
  notifications: INotification[]
}

class NotificationCards extends React.PureComponent<IProps> {
  keyExtractor(notification: INotification) {
    return notification.id
  }

  renderItem({ item: { actor: { username } } }: { item: INotification }) {
    return <NotificationCard username={username} />
  }

  render() {
    const { notifications } = this.props
    return (
      <FlatList
        data={notifications}
        ListHeaderComponent={CardItemSeparator}
        ListFooterComponent={CardItemSeparator}
        ItemSeparatorComponent={CardItemSeparator}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    )
  }
}

export default NotificationCards
