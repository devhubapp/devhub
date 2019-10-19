import {
  Column,
  EnhancedGitHubIssueOrPullRequest,
  getSearchQueryFromFilter,
} from '@devhub/core'
import React, { useCallback, useMemo } from 'react'
import { View, ViewProps } from 'react-native'
import { useDispatch } from 'react-redux'

import { useCardsKeyboard } from '../../hooks/use-cards-keyboard'
import { DataItemT, useCardsProps } from '../../hooks/use-cards-props'
import { useReduxState } from '../../hooks/use-redux-state'
import { BlurView } from '../../libs/blur-view/BlurView'
import { ErrorBoundary } from '../../libs/bugsnag'
import { OneList, OneListProps } from '../../libs/one-list'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { Spacer } from '../common/Spacer'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import {
  IssueOrPullRequestCard,
  IssueOrPullRequestCardProps,
} from './IssueOrPullRequestCard'
import { SwipeableCard } from './SwipeableCard'

type ItemT = EnhancedGitHubIssueOrPullRequest

export interface IssueOrPullRequestCardsProps
  extends Omit<
    IssueOrPullRequestCardProps,
    'columnId' | 'issueOrPullRequest' | 'type'
  > {
  column: Column
  columnIndex: number
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: (() => void) | undefined
  getItemById: (id: ItemT['id']) => ItemT | undefined
  itemIds: Array<ItemT['id']>
  lastFetchedSuccessfullyAt: string | undefined
  ownerIsKnown: boolean
  pointerEvents?: ViewProps['pointerEvents']
  refresh: EmptyCardsProps['refresh']
  repoIsKnown: boolean
  swipeable: boolean
}

export const IssueOrPullRequestCards = React.memo(
  (props: IssueOrPullRequestCardsProps) => {
    const {
      column,
      columnIndex,
      errorMessage,
      fetchNextPage,
      getItemById,
      itemIds,
      lastFetchedSuccessfullyAt,
      ownerIsKnown,
      pointerEvents,
      refresh,
      repoIsKnown,
      swipeable,
    } = props

    const listRef = React.useRef<typeof OneList>(null)

    const dispatch = useDispatch()

    const getItemKey = useCallback(
      (id: DataItemT<ItemT>, index: number) => {
        const item = getItemById(id)
        return `issue-or-pr-card-${(item && item.id) || index}`
      },
      [getItemById],
    )

    const loggedUsername = useReduxState(
      selectors.currentGitHubUsernameSelector,
    )!

    const {
      OverrideRender,
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
      column: column!,
      columnIndex,
      fetchNextPage,
      getItemById,
      itemIds,
      lastFetchedSuccessfullyAt,
      ownerIsKnown,
      refresh,
      repoIsKnown,
      type: 'issue_or_pr',
    })

    useCardsKeyboard(listRef, {
      columnId: (column && column.id)!,
      getItemById,
      itemIds:
        OverrideRender && OverrideRender.Component && OverrideRender.overlay
          ? []
          : itemIds,
      ownerIsKnown,
      repoIsKnown,
      type: 'issue_or_pr',
      visibleItemIndexesRef,
    })

    const renderItem = useCallback<
      NonNullable<OneListProps<DataItemT<ItemT>>['renderItem']>
    >(
      ({ item: id, index }) => {
        const item = getItemById(id)
        if (!item) return null

        const height = getItemSize(id, index)

        if (swipeable) {
          return (
            <View style={{ height }}>
              <SwipeableCard
                type="issue_or_pr"
                columnId={column.id}
                item={item}
                ownerIsKnown={ownerIsKnown}
                repoIsKnown={repoIsKnown}
              />
            </View>
          )
        }

        return (
          <ErrorBoundary>
            <View style={{ height }}>
              <IssueOrPullRequestCard
                columnId={column.id}
                issueOrPullRequest={item}
                ownerIsKnown={ownerIsKnown}
                repoIsKnown={repoIsKnown}
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

        if (maybeInvalidFilters) {
          return (
            <EmptyCards
              columnId={column.id}
              disableLoadingIndicator
              emoji={emptyFilters ? 'desert' : 'squirrel'}
              errorButtonView={
                <View>
                  <Button
                    analyticsLabel="try_fix_invalid_filter"
                    children={`Add "owner:${loggedUsername ||
                      'gaearon'}" filter`}
                    onPress={() =>
                      dispatch(
                        actions.setColumnOwnerFilter({
                          columnId: column.id,
                          owner: loggedUsername || 'gaearon',
                          value: true,
                        }),
                      )
                    }
                  />

                  <Spacer height={contentPadding / 2} />

                  <Button
                    analyticsLabel="try_fix_invalid_filter"
                    children={`Add "involves:${loggedUsername ||
                      'gaearon'}" filter`}
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
                </View>
              }
              errorMessage={
                emptyFilters
                  ? `You need to add some filters for this search to work. \nExample: author:${loggedUsername ||
                      'gaearon'}`
                  : `Something went wrong. Try changing your search query. \n${
                      messageHasMoreDetails
                        ? errorMessage
                        : `Example: author:${loggedUsername || 'gaearon'}`
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
            columnId={column.id}
            disableLoadingIndicator
            errorMessage={errorMessage}
            fetchNextPage={fetchNextPage}
            refresh={refresh}
          />
        )
      },
      [
        itemIds.length ? undefined : column,
        itemIds.length ? undefined : errorMessage,
        itemIds.length ? undefined : fetchNextPage,
        itemIds.length ? undefined : refresh,
        itemIds.length ? undefined : loggedUsername,
      ],
    )

    if (OverrideRender && OverrideRender.Component && !OverrideRender.overlay)
      return <OverrideRender.Component />

    return (
      <View style={sharedStyles.flex}>
        <OneList
          ref={listRef}
          key="issue-or-pr-cards-list"
          ListEmptyComponent={ListEmptyComponent}
          containerStyle={
            OverrideRender && OverrideRender.Component && OverrideRender.overlay
              ? sharedStyles.superMuted
              : undefined
          }
          data={data}
          estimatedItemSize={getItemSize(data[0], 0) || 89}
          footer={footer}
          getItemKey={getItemKey}
          getItemSize={getItemSize}
          header={header}
          horizontal={false}
          itemSeparator={itemSeparator}
          onVisibleItemsChanged={onVisibleItemsChanged}
          overscanCount={1}
          pointerEvents={
            OverrideRender && OverrideRender.Component && OverrideRender.overlay
              ? 'none'
              : pointerEvents
          }
          refreshControl={refreshControl}
          renderItem={renderItem}
          safeAreaInsets={safeAreaInsets}
        />

        {!!(
          OverrideRender &&
          OverrideRender.Component &&
          OverrideRender.overlay
        ) && (
          <BlurView intensity={8} style={sharedStyles.absoluteFill}>
            <OverrideRender.Component />
          </BlurView>
        )}
      </View>
    )
  },
)

IssueOrPullRequestCards.displayName = 'IssueOrPullRequestCards'
