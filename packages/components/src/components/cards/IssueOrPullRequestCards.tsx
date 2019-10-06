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
    'cachedCardProps' | 'columnId' | 'issueOrPullRequest' | 'type'
  > {
  column: Column
  columnIndex: number
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: (() => void) | undefined
  items: ItemT[]
  lastFetchedSuccessfullyAt: string | undefined
  ownerIsKnown: boolean
  pointerEvents?: ViewProps['pointerEvents']
  refresh: EmptyCardsProps['refresh']
  repoIsKnown: boolean
  swipeable: boolean
}

function getItemKey({ item }: DataItemT<ItemT>, _index: number) {
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
      lastFetchedSuccessfullyAt,
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
      type: 'issue_or_pr',
      repoIsKnown,
      refresh,
      ownerIsKnown,
      lastFetchedSuccessfullyAt,
      items,
      fetchNextPage,
      columnIndex,
      column: column!,
    })

    useCardsKeyboard(listRef, {
      columnId: (column && column.id)!,
      items:
        OverrideRender && OverrideRender.Component && OverrideRender.overlay
          ? []
          : items,
      ownerIsKnown,
      repoIsKnown,
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
              <SwipeableCard
                type="issue_or_pr"
                cachedCardProps={cachedCardProps}
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
                cachedCardProps={cachedCardProps}
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
        items.length ? undefined : column,
        items.length ? undefined : errorMessage,
        items.length ? undefined : fetchNextPage,
        items.length ? undefined : refresh,
        items.length ? undefined : loggedUsername,
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
