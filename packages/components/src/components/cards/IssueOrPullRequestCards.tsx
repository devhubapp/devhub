import React, { useCallback, useMemo, useRef } from 'react'
import { FlatList, FlatListProps, View } from 'react-native'

import {
  Column,
  constants,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedLoadState,
  getDateSmallText,
  getIssueOrPullRequestSubjectType,
  isItemRead,
  Omit,
} from '@devhub/core'
import useKeyPressCallback from '../../hooks/use-key-press-callback'
import { useKeyboardScrolling } from '../../hooks/use-keyboard-scrolling'
import { useReduxAction } from '../../hooks/use-redux-action'
import { bugsnag, ErrorBoundary } from '../../libs/bugsnag'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { fabSize } from '../common/FAB'
import { RefreshControl } from '../common/RefreshControl'
import { Spacer } from '../common/Spacer'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { fabSpacing, shouldRenderFAB } from '../layout/FABRenderer'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import {
  IssueOrPullRequestCard,
  IssueOrPullRequestCardProps,
} from './IssueOrPullRequestCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableIssueOrPullRequestCard } from './SwipeableIssueOrPullRequestCard'

export interface IssueOrPullRequestCardsProps
  extends Omit<
    IssueOrPullRequestCardProps,
    'isFocused' | 'issueOrPullRequest' | 'type'
  > {
  column: Column
  columnIndex: number
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: (() => void) | undefined
  items: EnhancedGitHubIssueOrPullRequest[]
  lastFetchedAt: string | undefined
  loadState: EnhancedLoadState
  refresh: EmptyCardsProps['refresh']
  swipeable?: boolean
}

function keyExtractor(item: EnhancedGitHubIssueOrPullRequest) {
  return `issue-or-pr-card-${item.id}`
}

export const IssueOrPullRequestCards = React.memo(
  (props: IssueOrPullRequestCardsProps) => {
    const {
      column,
      columnIndex,
      errorMessage,
      fetchNextPage,
      lastFetchedAt,
      loadState,
      items,
      refresh,
    } = props

    const flatListRef = React.useRef<
      FlatList<EnhancedGitHubIssueOrPullRequest>
    >(null)
    const visibleItemIndexesRef = useRef<number[]>([])

    const getVisibleItemIndex = useCallback(() => {
      if (
        !(visibleItemIndexesRef.current && visibleItemIndexesRef.current.length)
      )
        return

      return visibleItemIndexesRef.current[0]
    }, [])

    const [selectedItemId] = useKeyboardScrolling(flatListRef, {
      columnId: column.id,
      getVisibleItemIndex,
      items,
    })
    const { focusedColumnId } = useFocusedColumn()
    const _hasSelectedItem = !!selectedItemId && column.id === focusedColumnId
    const selectedItem =
      _hasSelectedItem && items.find(item => item.id === selectedItemId)

    const markItemsAsReadOrUnread = useReduxAction(
      actions.markItemsAsReadOrUnread,
    )
    const saveItemsForLater = useReduxAction(actions.saveItemsForLater)

    useKeyPressCallback(
      's',
      useCallback(() => {
        if (!selectedItem) return

        saveItemsForLater({
          itemIds: [selectedItemId!],
          save: !selectedItem.saved,
        })
      }, [selectedItem, selectedItemId]),
    )

    useKeyPressCallback(
      'r',
      useCallback(() => {
        if (!selectedItem) return

        markItemsAsReadOrUnread({
          type: 'issue_or_pr',
          itemIds: [selectedItemId!],
          unread: isItemRead(selectedItem),
        })
      }, [selectedItem, selectedItemId]),
    )

    const setColumnClearedAtFilter = useReduxAction(
      actions.setColumnClearedAtFilter,
    )

    const _handleViewableItemsChanged: FlatListProps<
      EnhancedGitHubIssueOrPullRequest
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
      item,
    }: {
      item: EnhancedGitHubIssueOrPullRequest
      index: number
    }) => {
      if (props.swipeable) {
        return (
          <SwipeableIssueOrPullRequestCard
            cardViewMode={props.cardViewMode}
            isFocused={
              column.id === focusedColumnId && item.id === selectedItemId
            }
            issueOrPullRequest={item}
            repoIsKnown={props.repoIsKnown}
            type={getIssueOrPullRequestSubjectType(item) || 'Issue'}
          />
        )
      }

      return (
        <ErrorBoundary>
          <IssueOrPullRequestCard
            cardViewMode={props.cardViewMode}
            isFocused={
              column.id === focusedColumnId && item.id === selectedItemId
            }
            issueOrPullRequest={item}
            repoIsKnown={props.repoIsKnown}
            type={getIssueOrPullRequestSubjectType(item) || 'Issue'}
          />
        </ErrorBoundary>
      )
    }
    const renderItem = useCallback(_renderItem, [
      column.id === focusedColumnId && selectedItemId,
      props.cardViewMode,
      props.repoIsKnown,
      props.swipeable,
    ])

    const renderFooter = useCallback(() => {
      const { sizename } = useAppLayout()

      return (
        <>
          <CardItemSeparator />

          {fetchNextPage ? (
            <View style={{ padding: contentPadding }}>
              <Button
                analyticsLabel={
                  loadState === 'error' ? 'try_again' : 'load_more'
                }
                children={
                  loadState === 'error' ? 'Oops. Try again' : 'Load more'
                }
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
        key="issue-or-pr-cards-flat-list"
        ItemSeparatorComponent={CardItemSeparator}
        ListFooterComponent={renderFooter}
        alwaysBounceVertical
        bounces
        data={items}
        extraData={rerender}
        initialNumToRender={15}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={3}
        onScrollToIndexFailed={onScrollToIndexFailed}
        onViewableItemsChanged={handleViewableItemsChanged}
        refreshControl={refreshControl}
        removeClippedSubviews
        renderItem={renderItem}
        viewabilityConfig={viewabilityConfig}
        windowSize={2}
      />
    )
  },
)
