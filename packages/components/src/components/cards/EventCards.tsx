import React from 'react'
import { FlatList, View } from 'react-native'

import { Column, constants, EnhancedGitHubEvent, LoadState } from '@devhub/core'
import { useKeyboardScrolling } from '../../hooks/use-keyboard-scrolling'
import { useReduxAction } from '../../hooks/use-redux-action'
import { ErrorBoundary } from '../../libs/bugsnag'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { FlatListWithOverlay } from '../common/FlatListWithOverlay'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { EventCard } from './EventCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableEventCard } from './SwipeableEventCard'

export interface EventCardsProps {
  column: Column
  columnIndex: number
  errorMessage: EmptyCardsProps['errorMessage']
  events: EnhancedGitHubEvent[]
  fetchNextPage: (() => void) | undefined
  loadState: LoadState
  refresh: EmptyCardsProps['refresh']
  repoIsKnown?: boolean
  swipeable?: boolean
}

export const EventCards = React.memo((props: EventCardsProps) => {
  const {
    column,
    columnIndex,
    errorMessage,
    events,
    fetchNextPage,
    loadState,
    refresh,
  } = props

  const [scrollOffsetY, setScrollOffsetY] = React.useState(0)
  const flatListRef = React.useRef<FlatList<View>>(null)

  useKeyboardScrolling({
    ref: flatListRef,
    currentOffset: scrollOffsetY,
    columnId: column.id,
  })

  const setColumnClearedAtFilter = useReduxAction(
    actions.setColumnClearedAtFilter,
  )

  if (columnIndex && columnIndex >= constants.COLUMNS_LIMIT) {
    return (
      <EmptyCards
        clearedAt={column.filters && column.filters.clearedAt}
        columnId={column.id}
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
        clearedAt={column.filters && column.filters.clearedAt}
        columnId={column.id}
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
    return (
      <>
        <CardItemSeparator />

        {fetchNextPage ? (
          <View style={{ padding: contentPadding }}>
            <Button
              analyticsLabel={loadState === 'error' ? 'try_again' : 'load_more'}
              children={loadState === 'error' ? 'Oops. Try again' : 'Load more'}
              disabled={loadState !== 'loaded'}
              loading={
                loadState === 'loading_first' || loadState === 'loading_more'
              }
              onPress={fetchNextPage}
            />
          </View>
        ) : column.filters && column.filters.clearedAt ? (
          <View style={{ padding: contentPadding }}>
            <Button
              analyticsLabel="show_cleared"
              borderOnly
              children="Show cleared items"
              disabled={loadState !== 'loaded'}
              onPress={() => {
                setColumnClearedAtFilter({
                  clearedAt: null,
                  columnId: column.id,
                })

                if (refresh) refresh()
              }}
            />
          </View>
        ) : null}
      </>
    )
  }

  return (
    <FlatListWithOverlay
      ref={flatListRef}
      data={events}
      ItemSeparatorComponent={CardItemSeparator}
      ListFooterComponent={renderFooter}
      extraData={loadState}
      initialNumToRender={10}
      keyExtractor={keyExtractor}
      removeClippedSubviews
      renderItem={renderItem}
      onScroll={e => setScrollOffsetY(e.nativeEvent.contentOffset.y)}
    />
  )
})
