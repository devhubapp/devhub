import React, { PureComponent } from 'react'

import SwipeableRow from '../../libs/swipeable'
import theme from '../../styles/themes/dark'
import EventCard, { IProps as ICardProps } from './EventCard'

export interface IProps extends ICardProps {}

export default class SwipeableEventCard extends PureComponent<IProps> {
  onArchive = () => {
    // alert('Archive')
  }

  onMarkAsRead = () => {
    // alert('Mark as read')
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
            onPress: this.onMarkAsRead,
            type: 'FULL',
          },
        ]}
        rightActions={[
          {
            color: theme.base01,
            icon: 'archive',
            key: 'archive',
            label: 'Archive',
            onPress: this.onArchive,
            type: 'FULL',
          },
        ]}
      >
        <EventCard {...this.props} />
      </SwipeableRow>
    )
  }
}
