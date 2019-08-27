import React, { useCallback, useMemo } from 'react'
import { View, ViewProps } from 'react-native'

import { Column, EnhancedGitHubEvent } from '@devhub/core'
import { useCardsKeyboard } from '../../hooks/use-cards-keyboard'
import { useCardsProps } from '../../hooks/use-cards-props'
import { ErrorBoundary } from '../../libs/bugsnag'
import { OneList, OneListProps } from '../../libs/one-list'
import { sharedStyles } from '../../styles/shared'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { EventCard, EventCardProps } from './EventCard'
import { SwipeableEventCard } from './SwipeableEventCard'

type ItemT = EnhancedGitHubEvent

export interface EventCardsProps
  extends Omit<EventCardProps, 'cachedCardProps' | 'event' | 'isFocused'> {
  column: Column
  columnIndex: number
  disableItemFocus: boolean
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: (() => void) | undefined
  items: ItemT[]
  lastFetchedAt: string | undefined
  ownerIsKnown: boolean
  pointerEvents: ViewProps['pointerEvents']
  refresh: EmptyCardsProps['refresh']
  repoIsKnown: boolean
  swipeable: boolean
}

function keyExtractor(item: ItemT) {
  return `event-card-${item.id}`
}

export const EventCards = React.memo((props: EventCardsProps) => {
  const {
    column,
    columnIndex,
    disableItemFocus,
    errorMessage,
    fetchNextPage,
    items,
    lastFetchedAt,
    ownerIsKnown,
    pointerEvents,
    refresh,
    repoIsKnown,
    swipeable,
  } = props

  const listRef = React.useRef<typeof OneList>(null)

  const { focusedColumnId } = useFocusedColumn()

  const {
    OverrideRenderComponent,
    firstVisibleItemIndexRef,
    footer,
    getItemSize,
    header,
    itemCardProps,
    itemSeparator,
    onVisibleItemsChanged,
    refreshControl,
  } = useCardsProps({
    column,
    columnIndex,
    fetchNextPage,
    items,
    lastFetchedAt,
    ownerIsKnown,
    refresh,
    repoIsKnown,
    type: 'activity',
  })

  const { selectedItemIdRef } = useCardsKeyboard(listRef, {
    columnId: column.id,
    enabled: focusedColumnId === column.id,
    firstVisibleItemIndexRef,
    items,
    type: 'activity',
  })

  const renderItem = useCallback<
    NonNullable<OneListProps<ItemT>['renderItem']>
  >(
    ({ item, index }) => {
      const height = getItemSize(item, index)

      if (swipeable) {
        return (
          <View style={{ height }}>
            <SwipeableEventCard
              cachedCardProps={itemCardProps[index]}
              event={item}
              isFocused={
                column.id === focusedColumnId &&
                item.id === selectedItemIdRef.current &&
                !disableItemFocus
              }
              ownerIsKnown={ownerIsKnown}
              repoIsKnown={repoIsKnown}
              swipeable={swipeable}
            />
          </View>
        )
      }

      return (
        <ErrorBoundary>
          <View style={{ height }}>
            <EventCard
              cachedCardProps={itemCardProps[index]}
              event={item}
              isFocused={
                column.id === focusedColumnId &&
                item.id === selectedItemIdRef.current &&
                !disableItemFocus
              }
              ownerIsKnown={ownerIsKnown}
              repoIsKnown={repoIsKnown}
              swipeable={swipeable}
            />
          </View>
        </ErrorBoundary>
      )
    },
    [
      column.id === focusedColumnId && selectedItemIdRef.current,
      getItemSize,
      itemCardProps,
      ownerIsKnown,
      repoIsKnown,
      swipeable,
    ],
  )

  const ListEmptyComponent = useMemo<
    NonNullable<OneListProps<ItemT>['ListEmptyComponent']>
  >(
    () => () => {
      return (
        <EmptyCards
          clearMessage="No new events!"
          column={column}
          disableLoadingIndicator
          errorMessage={errorMessage}
          fetchNextPage={fetchNextPage}
          refresh={refresh}
        />
      )
    },
    [
      items.length ? undefined : column,
      items.length ? undefined : errorMessage,
      items.length ? undefined : fetchNextPage,
      items.length ? undefined : refresh,
    ],
  )

  if (OverrideRenderComponent) return <OverrideRenderComponent />

  return (
    <View style={sharedStyles.flex}>
      <OneList
        ref={listRef}
        key="event-cards-list"
        ListEmptyComponent={ListEmptyComponent}
        data={items}
        estimatedItemSize={getItemSize(items[0], 0) || 89}
        footer={footer}
        getItemKey={keyExtractor}
        getItemSize={getItemSize}
        header={header}
        horizontal={false}
        itemSeparator={itemSeparator}
        onVisibleItemsChanged={onVisibleItemsChanged}
        overscanCount={5}
        pointerEvents={pointerEvents}
        refreshControl={refreshControl}
        renderItem={renderItem}
      />
    </View>
  )
})

EventCards.displayName = 'EventCards'
