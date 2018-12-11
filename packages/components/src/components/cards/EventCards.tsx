import React from 'react'
import { FlatList, View } from 'react-native'

import { EnhancedGitHubEvent, LoadState } from '@devhub/core/src/types'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { ErrorBoundary } from '../../libs/bugsnag'
import { contentPadding } from '../../styles/variables'
import { AnimatedTransparentTextOverlay } from '../animated/AnimatedTransparentTextOverlay'
import { Button } from '../common/Button'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { EventCard } from './EventCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableEventCard } from './SwipeableEventCard'

export interface EventCardsProps {
  errorMessage: EmptyCardsProps['errorMessage']
  events: EnhancedGitHubEvent[]
  fetchNextPage: ((params?: { perPage?: number }) => void) | undefined
  loadState: LoadState
  refresh: EmptyCardsProps['refresh']
  repoIsKnown?: boolean
  swipeable?: boolean
}

export const EventCards = React.memo((props: EventCardsProps) => {
  const theme = useAnimatedTheme()

  const { errorMessage, events, fetchNextPage, loadState, refresh } = props

  if (!(events && events.length))
    return (
      <EmptyCards
        errorMessage={errorMessage}
        fetchNextPage={fetchNextPage}
        loadState={loadState}
        refresh={refresh}
      />
    )

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
            analyticsLabel={loadState === 'error' ? 'try_again' : 'load_more'}
            children={loadState === 'error' ? 'Oops. Try again' : 'Load more'}
            disabled={loadState !== 'loaded'}
            loading={loadState === 'loading_more'}
            onPress={() => fetchNextPage()}
          />
        </View>
      </>
    )
  }

  return (
    <AnimatedTransparentTextOverlay
      color={theme.backgroundColor as any}
      size={contentPadding}
      from="vertical"
    >
      <FlatList
        data={events}
        ItemSeparatorComponent={CardItemSeparator}
        ListFooterComponent={renderFooter}
        extraData={loadState}
        initialNumToRender={5}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={5}
        removeClippedSubviews
        renderItem={renderItem}
      />
    </AnimatedTransparentTextOverlay>
  )
})
