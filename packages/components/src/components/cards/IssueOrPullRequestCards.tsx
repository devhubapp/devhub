import React, { useCallback, useMemo } from 'react'
import { View, ViewProps } from 'react-native'
import { useDispatch } from 'react-redux'

import {
  Column,
  EnhancedGitHubIssueOrPullRequest,
  getSearchQueryFromFilter,
} from '@devhub/core'
import { useCardsKeyboard } from '../../hooks/use-cards-keyboard'
import { DataItemT, useCardsProps } from '../../hooks/use-cards-props'
import { useReduxState } from '../../hooks/use-redux-state'
import { ErrorBoundary } from '../../libs/bugsnag'
import { OneList, OneListProps } from '../../libs/one-list'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { Button } from '../common/Button'
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
    'cachedCardProps' | 'columnId' | 'issueOrPullRequest' | 'type'
  > {
  column: Column
  columnIndex: number
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

function keyExtractor({ item }: DataItemT<ItemT>) {
  return `issue-or-pr-card-${item.id}`
}

export const IssueOrPullRequestCards = React.memo(
  (props: IssueOrPullRequestCardsProps) => {
    const {
      column,
      columnIndex,
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

    const loggedUsername = useReduxState(
      selectors.currentGitHubUsernameSelector,
    )

    const {
      OverrideRenderComponent,
      data,
      footer,
      getItemSize,
      header,
      itemSeparator,
      onVisibleItemsChanged,
      refreshControl,
      safeAreaInsets,
      visibleItemIndexesRef,
    } = useCardsProps({
      type: 'issue_or_pr',
      repoIsKnown,
      refresh,
      ownerIsKnown,
      lastFetchedAt,
      items,
      fetchNextPage,
      columnIndex,
      column,
    })

    useCardsKeyboard(listRef, {
      columnId: column.id,
      items,
      type: 'issue_or_pr',
      visibleItemIndexesRef,
    })

    const renderItem = useCallback<
      NonNullable<OneListProps<DataItemT<ItemT>>['renderItem']>
    >(
      ({ item: { cachedCardProps, height, item } }) => {
        if (swipeable) {
          return (
            <View style={{ height }}>
              <SwipeableIssueOrPullRequestCard
                cachedCardProps={cachedCardProps}
                columnId={column.id}
                issueOrPullRequest={item}
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
              <IssueOrPullRequestCard
                cachedCardProps={cachedCardProps}
                columnId={column.id}
                issueOrPullRequest={item}
                ownerIsKnown={ownerIsKnown}
                repoIsKnown={repoIsKnown}
                swipeable={swipeable}
              />
            </View>
          </ErrorBoundary>
        )
      },
      [ownerIsKnown, repoIsKnown, swipeable],
    )

    const ListEmptyComponent = useMemo<
      NonNullable<OneListProps<DataItemT<ItemT>>['ListEmptyComponent']>
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
          data={data}
          estimatedItemSize={getItemSize(data[0], 0) || 89}
          footer={footer}
          getItemKey={keyExtractor}
          getItemSize={getItemSize}
          header={header}
          horizontal={false}
          itemSeparator={itemSeparator}
          onVisibleItemsChanged={onVisibleItemsChanged}
          overscanCount={1}
          pointerEvents={pointerEvents}
          refreshControl={refreshControl}
          renderItem={renderItem}
          safeAreaInsets={safeAreaInsets}
        />
      </View>
    )
  },
)

IssueOrPullRequestCards.displayName = 'IssueOrPullRequestCards'
