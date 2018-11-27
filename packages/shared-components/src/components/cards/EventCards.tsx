import React, { PureComponent } from 'react'
import { FlatList, View } from 'react-native'

import { EnhancedGitHubEvent } from 'shared-core/dist/types'
import { ErrorBoundary } from '../../libs/bugsnag'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { TransparentTextOverlay } from '../common/TransparentTextOverlay'
import { ThemeConsumer } from '../context/ThemeContext'
import { EventCard } from './EventCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableEventCard } from './SwipeableEventCard'

export interface EventCardsProps {
  events: EnhancedGitHubEvent[]
  fetchNextPage: ((params?: { perPage?: number }) => void) | undefined
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

    return (
      <ErrorBoundary>
        <EventCard event={event} repoIsKnown={this.props.repoIsKnown} />
      </ErrorBoundary>
    )
  }

  renderFooter = () => {
    const { fetchNextPage } = this.props

    if (!fetchNextPage) return null

    return (
      <View style={{ padding: contentPadding }}>
        <Button onPress={() => fetchNextPage()} children="Load more" />
      </View>
    )
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
              ListFooterComponent={this.renderFooter}
              keyExtractor={this.keyExtractor}
              removeClippedSubviews
              renderItem={this.renderItem}
            />
          </TransparentTextOverlay>
        )}
      </ThemeConsumer>
    )
  }
}
