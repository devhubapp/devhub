import React, { PureComponent } from 'react'

import { SwipeableRow } from '../../libs/swipeable'
import * as colors from '../../styles/colors'
import { ThemeConsumer } from '../context/ThemeContext'
import { EventCard, EventCardProps } from './EventCard'

export interface SwipeableEventCardProps extends EventCardProps {}

export interface SwipeableEventCardState {}

export class SwipeableEventCard extends PureComponent<
  SwipeableEventCardProps,
  SwipeableEventCardState
> {
  onArchive = () => {
    // alert('Archive')
  }

  onMarkAsRead = () => {
    // alert('Mark as read')
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
                onPress: this.onMarkAsRead,
                type: 'FULL',
              },
            ]}
            rightActions={[
              {
                color: theme.backgroundColorMore08,
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
        )}
      </ThemeConsumer>
    )
  }
}
