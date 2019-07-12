import React, { useCallback, useMemo, useRef } from 'react'
import { Dimensions, View } from 'react-native'

import {
  Column,
  constants,
  EnhancedGitHubNotification,
  EnhancedLoadState,
  getDateSmallText,
  isItemRead,
} from '@devhub/core'
import useKeyPressCallback from '../../hooks/use-key-press-callback'
import { useKeyboardScrolling } from '../../hooks/use-keyboard-scrolling'
import { useReduxAction } from '../../hooks/use-redux-action'
import { bugsnag, ErrorBoundary } from '../../libs/bugsnag'
import { FlatList, FlatListProps } from '../../libs/flatlist'
import * as actions from '../../redux/actions'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { ColumnLoadingIndicator } from '../columns/ColumnLoadingIndicator'
import { Button, defaultButtonSize } from '../common/Button'
import { fabSize } from '../common/FAB'
import { RefreshControl } from '../common/RefreshControl'
import { Spacer } from '../common/Spacer'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { fabSpacing, shouldRenderFAB } from '../layout/FABRenderer'
import { CardsSearchHeader } from './CardsSearchHeader'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { NotificationCard, NotificationCardProps } from './NotificationCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableNotificationCard } from './SwipeableNotificationCard'

export interface NotificationCardsProps
  extends Omit<NotificationCardProps, 'notification' | 'isFocused'> {
  column: Column
  columnIndex: number
  disableItemFocus: boolean
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: (() => void) | undefined
  items: EnhancedGitHubNotification[]
  lastFetchedAt: string | undefined
  loadState: EnhancedLoadState
  pointerEvents: FlatListProps<any>['pointerEvents']
  refresh: EmptyCardsProps['refresh']
  repoIsKnown: boolean
  swipeable: boolean
}

function keyExtractor(item: EnhancedGitHubNotification) {
  return `notification-card-${item.id}`
}

export const NotificationCards = React.memo((props: NotificationCardsProps) => {
  const {
    cardViewMode,
    column,
    columnIndex,
    disableItemFocus,
    enableCompactLabels,
    errorMessage,
    fetchNextPage,
    items,
    lastFetchedAt,
    loadState,
    pointerEvents,
    refresh,
  } = props

  const flatListRef = React.useRef<FlatList<EnhancedGitHubNotification>>(null)

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
        type: 'notifications',
        itemIds: [selectedItemIdRef.current!],
        unread: isItemRead(selectedItem),
      })
    }, [hasSelectedItem, items]),
  )

  const setColumnClearedAtFilter = useReduxAction(
    actions.setColumnClearedAtFilter,
  )

  const _handleViewableItemsChanged: FlatListProps<
    EnhancedGitHubNotification
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

  const _renderItem: FlatListProps<
    EnhancedGitHubNotification
  >['renderItem'] = ({ item }) => {
    if (props.swipeable) {
      return (
        <SwipeableNotificationCard
          cardViewMode={cardViewMode}
          enableCompactLabels={enableCompactLabels}
          isFocused={
            column.id === focusedColumnId &&
            item.id === selectedItemIdRef.current &&
            !disableItemFocus
          }
          notification={item}
          repoIsKnown={props.repoIsKnown}
          swipeable={props.swipeable}
        />
      )
    }

    return (
      <ErrorBoundary>
        <NotificationCard
          cardViewMode={cardViewMode}
          enableCompactLabels={enableCompactLabels}
          isFocused={
            column.id === focusedColumnId &&
            item.id === selectedItemIdRef.current &&
            !disableItemFocus
          }
          notification={item}
          repoIsKnown={props.repoIsKnown}
          swipeable={props.swipeable}
        />
      </ErrorBoundary>
    )
  }
  const renderItem = useCallback(_renderItem, [
    cardViewMode,
    column.id === focusedColumnId && selectedItemIdRef.current,
    enableCompactLabels,
    props.repoIsKnown,
    props.swipeable,
  ])

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
        {!isEmpty && <CardItemSeparator muted={!fetchNextPage} />}

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
              paddingHorizontal:
                cardViewMode === 'compact'
                  ? contentPadding / 2
                  : contentPadding,
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
    column.filters && column.filters.clearedAt,
    column.id,
    refresh,
  ])

  const _onScrollToIndexFailed: FlatListProps<
    string
  >['onScrollToIndexFailed'] = (info: {
    index: number
    highestMeasuredFrameIndex: number
    averageItemLength: number
  }) => {
    console.error(info)
    bugsnag.notify({
      name: 'ScrollToIndexFailed',
      message: 'Failed to scroll to index',
      ...info,
    })
  }
  const onScrollToIndexFailed = useCallback(_onScrollToIndexFailed, [])

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

  function renderEmptyComponent() {
    return (
      <EmptyCards
        clearMessage="No new notifications!"
        column={column}
        disableLoadingIndicator
        errorMessage={errorMessage}
        fetchNextPage={fetchNextPage}
        loadState={loadState}
        refresh={refresh}
      />
    )
  }

  return (
    <FlatList
      ref={flatListRef}
      key="notification-cards-flat-list"
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
      disableVirtualization={false}
      extraData={rerender}
      initialNumToRender={Math.ceil(Dimensions.get('window').height / 120)}
      keyExtractor={keyExtractor}
      onScrollToIndexFailed={onScrollToIndexFailed}
      onViewableItemsChanged={handleViewableItemsChanged}
      pointerEvents={pointerEvents}
      refreshControl={refreshControl}
      removeClippedSubviews
      renderItem={renderItem}
      stickyHeaderIndices={[0]}
      viewabilityConfig={viewabilityConfig}
      windowSize={2}
    />
  )
})

NotificationCards.displayName = 'NotificationCards'
