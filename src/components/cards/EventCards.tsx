import React, { PureComponent } from 'react'

import { FlatList } from '../../libs/lists'
import theme from '../../styles/themes/dark'
import { contentPadding } from '../../styles/variables'
import { IGitHubEvent } from '../../types'
import TransparentTextOverlay from '../common/TransparentTextOverlay'
import EventCard from './EventCard'
import CardItemSeparator from './partials/CardItemSeparator'
import SwipeableEventCard from './SwipeableEventCard'

export interface EventCardsProps {
  events: IGitHubEvent[]
  swipeable?: boolean
}

export interface EventCardsState {}

export default class EventCards extends PureComponent<
  EventCardsProps,
  EventCardsState
> {
  keyExtractor(event: IGitHubEvent) {
    return `${event.id}`
  }

  renderItem = ({ item: event }: { item: IGitHubEvent }) => {
    if (this.props.swipeable)
      return <SwipeableEventCard key={`event-card-${event.id}`} event={event} />
    return <EventCard key={`event-card-${event.id}`} event={event} />
  }

  render() {
    const { events } = this.props

    return (
      <TransparentTextOverlay
        color={theme.base02}
        size={contentPadding}
        from="vertical"
      >
        <FlatList
          data={events}
          ItemSeparatorComponent={CardItemSeparator}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </TransparentTextOverlay>
    )
  }
}
