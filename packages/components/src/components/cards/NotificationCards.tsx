import React, { useCallback, useMemo, useRef } from 'react'
import { View } from 'react-native'

import {
  Column,
  constants,
  EnhancedGitHubNotification,
  EnhancedLoadState,
  getDateSmallText,
  isItemRead,
} from '@devhub/core'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import useKeyPressCallback from '../../hooks/use-key-press-callback'
import { useKeyboardScrolling } from '../../hooks/use-keyboard-scrolling'
import { useReduxAction } from '../../hooks/use-redux-action'
import { bugsnag, ErrorBoundary } from '../../libs/bugsnag'
import { FlatList, FlatListProps } from '../../libs/flatlist'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import { Button } from '../common/Button'
import { fabSize } from '../common/FAB'
import { RefreshControl } from '../common/RefreshControl'
import { Spacer } from '../common/Spacer'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { useTheme } from '../context/ThemeContext'
import { fabSpacing, shouldRenderFAB } from '../layout/FABRenderer'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { NotificationCard, NotificationCardProps } from './NotificationCard'
import {
  CardItemSeparator,
  getCardItemSeparatorThemeColor,
} from './partials/CardItemSeparator'
import { SwipeableNotificationCard } from './SwipeableNotificationCard'

export interface NotificationCardsProps
  extends Omit<NotificationCardProps, 'notification' | 'isFocused'> {
  column: Column
  columnIndex: number
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

  const { appViewMode } = useAppViewMode()
  const { inlineMode } = useColumnFilters()
  const theme = useTheme()

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

  const _renderItem = ({
    item: item,
  }: {
    item: EnhancedGitHubNotification
    index: number
  }) => {
    if (props.swipeable) {
      return (
        <SwipeableNotificationCard
          cardViewMode={cardViewMode}
          enableCompactLabels={enableCompactLabels}
          isFocused={
            column.id === focusedColumnId &&
            item.id === selectedItemIdRef.current
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
            item.id === selectedItemIdRef.current
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

  const renderFooter = useCallback(() => {
    const { sizename } = useAppLayout()

    return (
      <>
        <CardItemSeparator muted />

        {fetchNextPage ? (
          <View>
            <Button
              analyticsLabel={loadState === 'error' ? 'try_again' : 'load_more'}
              children={loadState === 'error' ? 'Oops. Try again' : 'Load more'}
              disabled={loadState !== 'loaded'}
              loading={
                loadState === 'loading_first' || loadState === 'loading_more'
              }
              onPress={fetchNextPage}
              round={false}
            />
          </View>
        ) : column.filters && column.filters.clearedAt ? (
          <View>
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
              round={false}
              transparent
            />

            <CardItemSeparator muted />
          </View>
        ) : null}

        {shouldRenderFAB({ sizename }) && (
          <Spacer height={fabSize + 2 * fabSpacing} />
        )}
      </>
    )
  }, [
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
        refreshing={loadState === 'loading' || loadState === 'loading_first'}
        title={
          lastFetchedAt
            ? `Last updated ${getDateSmallText(lastFetchedAt, true)}`
            : 'Pull to refresh'
        }
      />
    ),
    [lastFetchedAt, refresh, loadState],
  )

  const rerender = useMemo(() => ({}), [renderItem, renderFooter])

  const contentContainerStyle = useMemo(
    () => ({
      borderWidth: appViewMode === 'single-column' && inlineMode ? 1 : 0,
      borderColor:
        theme[getCardItemSeparatorThemeColor(theme.backgroundColor, true)],
    }),
    [theme],
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

  if (!(items && items.length)) {
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

  return (
    <FlatList
      ref={flatListRef}
      key="notification-cards-flat-list"
      ItemSeparatorComponent={CardItemSeparator}
      ListFooterComponent={renderFooter}
      alwaysBounceVertical
      bounces
      contentContainerStyle={contentContainerStyle}
      data={items}
      disableVirtualization={Platform.OS === 'web'}
      extraData={rerender}
      initialNumToRender={15}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={3}
      onScrollToIndexFailed={onScrollToIndexFailed}
      onViewableItemsChanged={handleViewableItemsChanged}
      pointerEvents={pointerEvents}
      refreshControl={refreshControl}
      removeClippedSubviews={Platform.OS !== 'web'}
      renderItem={renderItem}
      viewabilityConfig={viewabilityConfig}
      windowSize={2}
    />
  )
})
