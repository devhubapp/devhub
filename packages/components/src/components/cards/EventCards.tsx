import React from 'react'
import { FlatList, View } from 'react-native'

import { EnhancedGitHubEvent, LoadState } from '@devhub/core/src/types'
import { ErrorBoundary } from '../../libs/bugsnag'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { TransparentTextOverlay } from '../common/TransparentTextOverlay'
import { useTheme } from '../context/ThemeContext'
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
  const theme = useTheme()

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
