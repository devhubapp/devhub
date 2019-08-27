import React, { useCallback, useMemo } from 'react'
import { View, ViewProps } from 'react-native'
import { useDispatch } from 'react-redux'

import {
  Column,
  EnhancedGitHubIssueOrPullRequest,
  getIssueOrPullRequestSubjectType,
  getSearchQueryFromFilter,
} from '@devhub/core'
import { useCardsKeyboard } from '../../hooks/use-cards-keyboard'
import { useCardsProps } from '../../hooks/use-cards-props'
import { useReduxState } from '../../hooks/use-redux-state'
import { ErrorBoundary } from '../../libs/bugsnag'
import { OneList, OneListProps } from '../../libs/one-list'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { Button } from '../common/Button'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import {
  IssueOrPullRequestCard,
  IssueOrPullRequestCardProps,
} from './IssueOrPullRequestCard'
import { SwipeableIssueOrPullRequestCard } from './SwipeableIssueOrPullRequestCard'

type ItemT = EnhancedGitHubIssueOrPullRequest

export interface IssueOrPullRequestCardsProps
  extends Omit<
    IssueOrPullRequestCardProps,
    'cachedCardProps' | 'issueOrPullRequest' | 'isFocused' | 'type'
  > {
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
  return `issue-or-pr-card-${item.id}`
}

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
      ownerIsKnown,
      pointerEvents,
      refresh,
      repoIsKnown,
      swipeable,
    } = props

    const listRef = React.useRef<typeof OneList>(null)

    const dispatch = useDispatch()
    const { focusedColumnId } = useFocusedColumn()

    const loggedUsername = useReduxState(
      selectors.currentGitHubUsernameSelector,
    )

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
      type: 'issue_or_pr',
    })

    const { selectedItemIdRef } = useCardsKeyboard(listRef, {
      columnId: column.id,
      enabled: focusedColumnId === column.id,
      firstVisibleItemIndexRef,
      items,
      type: 'issue_or_pr',
    })

    const renderItem = useCallback<
      NonNullable<OneListProps<ItemT>['renderItem']>
    >(
      ({ item, index }) => {
        const height = getItemSize(item, index)

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
                    dispatch(
                      actions.setColumnInvolvesFilter({
                        columnId: column.id,
                        user: loggedUsername || 'gaearon',
                        value: true,
                      }),
                    )
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
            refresh={refresh}
          />
        )
      },
      [
        items.length ? undefined : column,
        items.length ? undefined : errorMessage,
        items.length ? undefined : fetchNextPage,
        items.length ? undefined : refresh,
        items.length ? undefined : loggedUsername,
      ],
    )

    if (OverrideRenderComponent) return <OverrideRenderComponent />

    return (
      <View style={sharedStyles.flex}>
        <OneList
          ref={listRef}
          key="issue-or-pr-cards-list"
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
  },
)

IssueOrPullRequestCards.displayName = 'IssueOrPullRequestCards'
