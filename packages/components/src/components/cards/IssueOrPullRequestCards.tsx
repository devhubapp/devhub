import React, { useCallback, useMemo, useRef } from 'react'
import { Dimensions, View } from 'react-native'

import {
  Column,
  constants,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedLoadState,
  getDateSmallText,
  getIssueOrPullRequestSubjectType,
  getSearchQueryFromFilter,
  isItemRead,
} from '@devhub/core'
import { useCardGetItemLayout } from '../../hooks/use-card-get-item-layout'
import useKeyPressCallback from '../../hooks/use-key-press-callback'
import { useKeyboardScrolling } from '../../hooks/use-keyboard-scrolling'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { bugsnag, ErrorBoundary } from '../../libs/bugsnag'
import { FlatList, FlatListProps } from '../../libs/flatlist'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
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
import {
  IssueOrPullRequestCard,
  IssueOrPullRequestCardProps,
} from './IssueOrPullRequestCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableIssueOrPullRequestCard } from './SwipeableIssueOrPullRequestCard'

export interface IssueOrPullRequestCardsProps
  extends Omit<
    IssueOrPullRequestCardProps,
    'cachedCardProps' | 'isFocused' | 'issueOrPullRequest' | 'type'
  > {
  column: Column
  columnIndex: number
  disableItemFocus: boolean
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: (() => void) | undefined
  items: EnhancedGitHubIssueOrPullRequest[]
  lastFetchedAt: string | undefined
  loadState: EnhancedLoadState
  pointerEvents: FlatListProps<
    EnhancedGitHubIssueOrPullRequest
  >['pointerEvents']
  refresh: EmptyCardsProps['refresh']
  swipeable: boolean
}

function keyExtractor(item: EnhancedGitHubIssueOrPullRequest) {
  return `issue-or-pr-card-${item.id}`
}

const stickyHeaderIndices = [0]

export const IssueOrPullRequestCards = React.memo(
  (props: IssueOrPullRequestCardsProps) => {
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

    const { selectedItemIdRef } = useKeyboardScrolling(flatListRef, {
      columnId: column.id,
      getVisibleItemIndex,
      items,
    })
    const { focusedColumnId } = useFocusedColumn()

    const hasSelectedItem =
      !!selectedItemIdRef.current && column.id === focusedColumnId

    const loggedUsername = useReduxState(
      selectors.currentGitHubUsernameSelector,
    )

    const markItemsAsReadOrUnread = useReduxAction(
      actions.markItemsAsReadOrUnread,
    )
    const saveItemsForLater = useReduxAction(actions.saveItemsForLater)
    const setColumnInvolvesFilter = useReduxAction(
      actions.setColumnInvolvesFilter,
    )

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
          type: 'issue_or_pr',
          itemIds: [selectedItemIdRef.current!],
          unread: isItemRead(selectedItem),
        })
      }, [hasSelectedItem, items]),
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

    const isEmpty = !items.length

    const { getItemLayout, itemCardProps, itemLayouts } = useCardGetItemLayout(
      'issue_or_pr',
      items,
      {
        ownerIsKnown,
        repoIsKnown,
      },
    )

    const renderItem = useCallback<
      NonNullable<FlatListProps<EnhancedGitHubIssueOrPullRequest>['renderItem']>
    >(
      ({ item, index }) => {
        const height = itemLayouts[index] && itemLayouts[index]!.length

        if (swipeable) {
          return (
            <View style={{ height }}>
              <SwipeableIssueOrPullRequestCard
                cachedCardProps={itemCardProps[index]}
                isFocused={
                  column.id === focusedColumnId &&
                  item.id === selectedItemIdRef.current &&
                  !disableItemFocus
                }
                issueOrPullRequest={item}
                ownerIsKnown={ownerIsKnown}
                repoIsKnown={repoIsKnown}
                swipeable={swipeable}
                type={getIssueOrPullRequestSubjectType(item) || 'Issue'}
              />
            </View>
          )
        }

        return (
          <ErrorBoundary>
            <View style={{ height }}>
              <IssueOrPullRequestCard
                cachedCardProps={itemCardProps[index]}
                isFocused={
                  column.id === focusedColumnId &&
                  item.id === selectedItemIdRef.current &&
                  !disableItemFocus
                }
                issueOrPullRequest={item}
                ownerIsKnown={ownerIsKnown}
                repoIsKnown={repoIsKnown}
                swipeable={swipeable}
                type={getIssueOrPullRequestSubjectType(item) || 'Issue'}
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
                analyticsLabel={
                  loadState === 'error' ? 'try_again' : 'load_more'
                }
                children={
                  loadState === 'error' ? 'Oops. Try again' : 'Load more'
                }
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
      column.filters && column.filters.clearedAt,
      column.id,
      refresh,
    ])

    const renderEmptyComponent = useCallback(() => {
      const maybeInvalidFilters = `${errorMessage || ''}`
        .toLowerCase()
        .startsWith('validation failed')
      const messageHasMoreDetails =
        `${errorMessage || ''}` !== 'validation failed'
      const emptyFilters =
        maybeInvalidFilters &&
        !getSearchQueryFromFilter(column.type, column.filters)

      const exampleFilter = `involves:${loggedUsername || 'gaearon'}`

      if (maybeInvalidFilters) {
        return (
          <EmptyCards
            column={column}
            disableLoadingIndicator
            emoji={emptyFilters ? 'desert' : 'squirrel'}
            errorButtonView={
              <Button
                analyticsLabel="try_fix_invalid_filter"
                children={`Add "${exampleFilter}" filter`}
                onPress={() =>
                  setColumnInvolvesFilter({
                    columnId: column.id,
                    user: loggedUsername || 'gaearon',
                    value: true,
                  })
                }
              />
            }
            errorMessage={
              emptyFilters
                ? `You need to add some filters for this search to work. \nExample: ${exampleFilter}`
                : `Something went wrong. Try changing your search query. \n${
                    messageHasMoreDetails
                      ? errorMessage
                      : `Example: ${exampleFilter}`
                  }`
            }
            errorTitle={
              emptyFilters ? 'Empty search' : 'Check your search query'
            }
            fetchNextPage={undefined}
            loadState={loadState}
            refresh={undefined}
          />
        )
      }

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
      items.length ? undefined : loggedUsername,
    ])

    const onScrollToIndexFailed = useCallback<
      NonNullable<
        FlatListProps<EnhancedGitHubIssueOrPullRequest>['onScrollToIndexFailed']
      >
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

    const rerender = useMemo(() => ({}), [
      renderItem,
      renderHeader,
      renderFooter,
    ])

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

    const _estimatedItemSize = (getItemLayout(items, 0) || {}).length || 89
    const _nItemsThatFitInTheWindow = Math.ceil(
      Dimensions.get('window').height / _estimatedItemSize,
    )

    return (
      <FlatList
        ref={flatListRef}
        key="issue-or-pr-cards-flat-list"
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
  },
)

IssueOrPullRequestCards.displayName = 'IssueOrPullRequestCards'
