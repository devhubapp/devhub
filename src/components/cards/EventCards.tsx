import React, { PureComponent } from 'react'

import { FlatList } from '../../libs/lists'
import { contentPadding } from '../../styles/variables'
import { EnhancedGitHubEvent } from '../../types'
import { TransparentTextOverlay } from '../common/TransparentTextOverlay'
import { ThemeConsumer } from '../context/ThemeContext'
import { EventCard } from './EventCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableEventCard } from './SwipeableEventCard'

export interface EventCardsProps {
  events: EnhancedGitHubEvent[]
  repoIsKnown?: boolean
  swipeable?: boolean
}

export interface EventCardsState {}

export class EventCards extends PureComponent<
  EventCardsProps,
  EventCardsState
> {
  keyExtractor(event: EnhancedGitHubEvent) {
    return `event-card-${event.id}`
  }

  renderItem = ({ item: event }: { item: EnhancedGitHubEvent }) => {
    if (this.props.swipeable) {
      return (
        <SwipeableEventCard
          event={event}
          repoIsKnown={this.props.repoIsKnown}
        />
      )
    }

    return <EventCard event={event} repoIsKnown={this.props.repoIsKnown} />
  }

  render() {
    const { events } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <TransparentTextOverlay
            color={theme.backgroundColor}
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
        )}
      </ThemeConsumer>
    )
  }
}
