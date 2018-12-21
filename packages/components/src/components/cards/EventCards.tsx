import React from 'react'
import { FlatList, View } from 'react-native'

import { constants, EnhancedGitHubEvent, LoadState } from '@devhub/core'
import { ErrorBoundary } from '../../libs/bugsnag'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { AnimatedTransparentTextOverlay } from '../common/TransparentTextOverlay'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { EventCard } from './EventCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableEventCard } from './SwipeableEventCard'

export interface EventCardsProps {
  columnIndex: number
  errorMessage: EmptyCardsProps['errorMessage']
  events: EnhancedGitHubEvent[]
  fetchNextPage: ((params?: { perPage?: number }) => void) | undefined
  loadState: LoadState
  refresh: EmptyCardsProps['refresh']
  repoIsKnown?: boolean
  swipeable?: boolean
}

export const EventCards = React.memo((props: EventCardsProps) => {
  const {
    columnIndex,
    errorMessage,
    events,
    fetchNextPage,
    loadState,
    refresh,
  } = props

  if (columnIndex && columnIndex >= constants.COLUMNS_LIMIT) {
    return (
      <EmptyCards
        errorMessage={`You have reached the limit of ${
          constants.COLUMNS_LIMIT
        } columns. This is to maintain a healthy usage of the GitHub API.`}
        errorTitle="Too many columns"
        fetchNextPage={undefined}
        loadState="error"
        refresh={undefined}
      />
    )
  }

  if (!(events && events.length)) {
    return (
      <EmptyCards
        errorMessage={errorMessage}
        fetchNextPage={fetchNextPage}
        loadState={loadState}
        refresh={refresh}
      />
    )
  }

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
      from="vertical"
      size={contentPadding}
      themeColor="backgroundColor"
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
