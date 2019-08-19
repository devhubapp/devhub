import React, { useCallback, useMemo, useRef } from 'react'
import { Dimensions, View } from 'react-native'

import {
  Column,
  constants,
  EnhancedGitHubEvent,
  EnhancedLoadState,
  getDateSmallText,
  isItemRead,
} from '@devhub/core'
import { useCardGetItemLayout } from '../../hooks/use-card-get-item-layout'
import useKeyPressCallback from '../../hooks/use-key-press-callback'
import { useKeyboardScrolling } from '../../hooks/use-keyboard-scrolling'
import { useReduxAction } from '../../hooks/use-redux-action'
import { bugsnag, ErrorBoundary } from '../../libs/bugsnag'
import { FlatList, FlatListProps } from '../../libs/flatlist'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { ColumnLoadingIndicator } from '../columns/ColumnLoadingIndicator'
import { Button, defaultButtonSize } from '../common/Button'
import { ButtonLink } from '../common/ButtonLink'
import { fabSize } from '../common/FAB'
import { RefreshControl } from '../common/RefreshControl'
import { Spacer } from '../common/Spacer'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { fabSpacing, shouldRenderFAB } from '../layout/FABRenderer'
import { CardsSearchHeader } from './CardsSearchHeader'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { EventCard, EventCardProps } from './EventCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableEventCard } from './SwipeableEventCard'

export interface EventCardsProps
  extends Omit<EventCardProps, 'cachedCardProps' | 'event' | 'isFocused'> {
  column: Column
  columnIndex: number
  disableItemFocus: boolean
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: (() => void) | undefined
  items: EnhancedGitHubEvent[]
  lastFetchedAt: string | undefined
  loadState: EnhancedLoadState
  ownerIsKnown: boolean
  pointerEvents: FlatListProps<EnhancedGitHubEvent>['pointerEvents']
  refresh: EmptyCardsProps['refresh']
  repoIsKnown: boolean
  swipeable: boolean
}

function keyExtractor(item: EnhancedGitHubEvent, _index: number) {
  return `event-card-${item.id}`
}

const stickyHeaderIndices = [0]

export const EventCards = React.memo((props: EventCardsProps) => {
  const {
    column,
    columnIndex,
    disableItemFocus,
    errorMessage,
    fetchNextPage,
    items,
    lastFetchedAt,
    loadState,
    ownerIsKnown,
    pointerEvents,
    refresh,
    repoIsKnown,
    swipeable,
  } = props

  const flatListRef = React.useRef<FlatList<EnhancedGitHubEvent>>(null)

  const visibleItemIndexesRef = useRef<number[]>([])

  const getVisibleItemIndex = useCallback(() => {
    if (
      !(visibleItemIndexesRef.current && visibleItemIndexesRef.current.length)
    )
      return

    return visibleItemIndexesRef.current[0]
  }, [])

  const { selectedItemIdRef } = useKeyboardScrolling(flatListRef, {
    columnId: column.id,
    getVisibleItemIndex,
    items,
  })
  const { focusedColumnId } = useFocusedColumn()

  const hasSelectedItem =
    !!selectedItemIdRef.current && column.id === focusedColumnId

  const markItemsAsReadOrUnread = useReduxAction(
    actions.markItemsAsReadOrUnread,
  )
  const saveItemsForLater = useReduxAction(actions.saveItemsForLater)

  useKeyPressCallback(
    's',
    useCallback(() => {
      const selectedItem =
        hasSelectedItem &&
        items.find(item => item.id === selectedItemIdRef.current)

      if (!selectedItem) return

      saveItemsForLater({
        itemIds: [selectedItemIdRef.current!],
        save: !selectedItem.saved,
      })
    }, [hasSelectedItem, items]),
  )

  useKeyPressCallback(
    'r',
    useCallback(() => {
      const selectedItem =
        hasSelectedItem &&
        items.find(item => item.id === selectedItemIdRef.current)
      if (!selectedItem) return

      markItemsAsReadOrUnread({
        type: 'activity',
        itemIds: [selectedItemIdRef.current!],
        unread: isItemRead(selectedItem),
      })
    }, [hasSelectedItem, items]),
  )

  const setColumnClearedAtFilter = useReduxAction(
    actions.setColumnClearedAtFilter,
  )

  const _handleViewableItemsChanged: FlatListProps<
    EnhancedGitHubEvent
  >['onViewableItemsChanged'] = ({ viewableItems }) => {
    visibleItemIndexesRef.current = viewableItems
      .filter(v => v.isViewable && typeof v.index === 'number')
      .map(v => v.index!)
  }
  const handleViewableItemsChanged = useCallback(
    _handleViewableItemsChanged,
    [],
  )

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 100,
    }),
    [],
  )

  const isEmpty = !items.length

  const { getItemLayout, itemLayouts, itemCardProps } = useCardGetItemLayout(
    'activity',
    items,
    { ownerIsKnown, repoIsKnown },
  )

  const renderItem = useCallback<
    NonNullable<FlatListProps<EnhancedGitHubEvent>['renderItem']>
  >(
    ({ item, index }) => {
      const height = itemLayouts[index] && itemLayouts[index]!.length

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
      itemCardProps,
      itemLayouts,
      ownerIsKnown,
      repoIsKnown,
      swipeable,
    ],
  )

  const renderHeader = useCallback(() => {
    return (
      <>
        <CardsSearchHeader
          key={`cards-search-header-column-${column.id}`}
          columnId={column.id}
        />

        <ColumnLoadingIndicator columnId={column.id} />
      </>
    )
  }, [column.id])

  const renderFooter = useCallback(() => {
    const { sizename } = useAppLayout()

    return (
      <>
        {!isEmpty && <CardItemSeparator />}

        {fetchNextPage ? (
          <View>
            <Button
              analyticsLabel={loadState === 'error' ? 'try_again' : 'load_more'}
              children={loadState === 'error' ? 'Oops. Try again' : 'Load more'}
              disabled={
                loadState === 'loading' ||
                loadState === 'loading_first' ||
                loadState === 'loading_more'
              }
              loading={loadState === 'loading_more'}
              onPress={fetchNextPage}
              round={false}
            />
          </View>
        ) : column.filters && column.filters.clearedAt ? (
          <View
            style={{
              paddingVertical: fabSpacing + (fabSize - defaultButtonSize) / 2,
              paddingHorizontal: contentPadding,
            }}
          >
            <Button
              analyticsLabel="show_cleared"
              children="Show cleared items"
              onPress={() => {
                setColumnClearedAtFilter({
                  clearedAt: null,
                  columnId: column.id,
                })

                if (refresh) refresh()
              }}
              round
              showBorder
              transparent
            />
          </View>
        ) : null}

        {!isEmpty && shouldRenderFAB({ sizename }) && (
          <Spacer height={fabSize + 2 * fabSpacing} />
        )}
      </>
    )
  }, [
    isEmpty,
    fetchNextPage,
    loadState,
    column.id,
    column.filters && column.filters.clearedAt,
    refresh,
  ])

  const renderEmptyComponent = useCallback(() => {
    return (
      <EmptyCards
        column={column}
        disableLoadingIndicator
        errorMessage={errorMessage}
        fetchNextPage={fetchNextPage}
        loadState={loadState}
        refresh={refresh}
      />
    )
  }, [
    items.length ? undefined : column,
    items.length ? undefined : errorMessage,
    items.length ? undefined : fetchNextPage,
    items.length ? undefined : loadState,
    items.length ? undefined : refresh,
  ])

  const onScrollToIndexFailed = useCallback<
    NonNullable<FlatListProps<EnhancedGitHubEvent>['onScrollToIndexFailed']>
  >(info => {
    console.error(info)
    bugsnag.notify({
      name: 'ScrollToIndexFailed',
      message: 'Failed to scroll to index',
      ...info,
    })
  }, [])

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        intervalRefresh={lastFetchedAt}
        onRefresh={refresh}
        refreshing={false}
        title={
          lastFetchedAt
            ? `Last updated ${getDateSmallText(lastFetchedAt, true)}`
            : 'Pull to refresh'
        }
      />
    ),
    [lastFetchedAt, refresh],
  )

  const rerender = useMemo(() => ({}), [renderItem, renderHeader, renderFooter])

  if (columnIndex && columnIndex >= constants.COLUMNS_LIMIT) {
    return (
      <EmptyCards
        column={column}
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

  if (isEmpty && errorMessage === 'Resource not accessible by integration') {
    return (
      <EmptyCards
        column={column}
        emoji="confused"
        errorButtonView={
          <ButtonLink
            analyticsLabel="open_private_issue"
            children="Open GitHub Issue To Upvote"
            disabled={loadState !== 'error'}
            href="https://github.com/devhubapp/devhub/issues/140"
            loading={loadState === 'loading'}
          />
        }
        errorTitle="Private access temporarily disabled"
        errorMessage="GitHub has temporarily disabled private access for this specific API endpoint. Please upvote the issue below to show your interest on a fix."
        fetchNextPage={undefined}
        loadState={loadState}
        refresh={refresh}
      />
    )
  }

  const _estimatedItemSize = (getItemLayout(items, 0) || {}).length || 89
  const _nItemsThatFitInTheWindow = Math.ceil(
    Dimensions.get('window').height / _estimatedItemSize,
  )

  return (
    <FlatList
      ref={flatListRef}
      ItemSeparatorComponent={CardItemSeparator}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderFooter}
      ListHeaderComponent={renderHeader}
      alwaysBounceVertical
      bounces
      contentContainerStyle={isEmpty && sharedStyles.flexGrow}
      // contentOffset={{ x: 0, y: cardSearchTotalHeight }}
      data-flatlist-with-header-content-container-full-height-fix={isEmpty}
      data={items}
      disableVirtualization={Platform.OS === 'web'}
      extraData={rerender}
      getItemLayout={getItemLayout}
      initialNumToRender={_nItemsThatFitInTheWindow}
      keyExtractor={keyExtractor}
      onScrollToIndexFailed={onScrollToIndexFailed}
      onViewableItemsChanged={handleViewableItemsChanged}
      pointerEvents={pointerEvents}
      refreshControl={refreshControl}
      removeClippedSubviews={Platform.OS !== 'web'}
      renderItem={renderItem}
      stickyHeaderIndices={stickyHeaderIndices}
      viewabilityConfig={viewabilityConfig}
      windowSize={2}
    />
  )
})

EventCards.displayName = 'EventCards'
