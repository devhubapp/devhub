import React from 'react'
import { FlatList, View } from 'react-native'

import { EnhancedGitHubEvent, LoadState } from '@devhub/core/dist/types'
import { ErrorBoundary } from '../../libs/bugsnag'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { TransparentTextOverlay } from '../common/TransparentTextOverlay'
import { useTheme } from '../context/ThemeContext'
import { EmptyCards } from './EmptyCards'
import { EventCard } from './EventCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableEventCard } from './SwipeableEventCard'

export interface EventCardsProps {
  events: EnhancedGitHubEvent[]
  fetchNextPage: ((params?: { perPage?: number }) => void) | undefined
  loadState: LoadState
  repoIsKnown?: boolean
  swipeable?: boolean
}

export const EventCards = React.memo((props: EventCardsProps) => {
  const theme = useTheme()

  const { events, fetchNextPage, loadState } = props

  if (!(events && events.length))
    return <EmptyCards fetchNextPage={fetchNextPage} loadState={loadState} />

  function keyExtractor(event: EnhancedGitHubEvent) {
    return `event-card-${event.id}`
  }

  function renderItem({ item: event }: { item: EnhancedGitHubEvent }) {
    if (props.swipeable) {
      return (
        <SwipeableEventCard event={event} repoIsKnown={props.repoIsKnown} />
      )
    }

    return (
      <ErrorBoundary>
        <EventCard event={event} repoIsKnown={props.repoIsKnown} />
      </ErrorBoundary>
    )
  }

  function renderFooter() {
    if (!fetchNextPage) return <CardItemSeparator />

    return (
      <>
        <CardItemSeparator />
        <View style={{ padding: contentPadding }}>
          <Button
            disabled={loadState !== 'loaded'}
            loading={loadState === 'loading_more'}
            onPress={() => fetchNextPage()}
            children="Load more"
          />
        </View>
      </>
    )
  }

  return (
    <TransparentTextOverlay
      color={theme.backgroundColor}
      size={contentPadding}
      from="vertical"
    >
      <FlatList
        data={events}
        extraData={loadState}
        ItemSeparatorComponent={CardItemSeparator}
        ListFooterComponent={renderFooter}
        keyExtractor={keyExtractor}
        removeClippedSubviews
        renderItem={renderItem}
      />
    </TransparentTextOverlay>
  )
})
