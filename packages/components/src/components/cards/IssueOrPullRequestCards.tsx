import {
  Column,
  EnhancedGitHubIssueOrPullRequest,
  getSearchQueryFromFilter,
} from '@devhub/core'
import React, { useCallback, useMemo } from 'react'
import { View, ViewProps } from 'react-native'
import { useDispatch, useStore } from 'react-redux'

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
import { IssueOrPullRequestCard } from './IssueOrPullRequestCard'
import { SwipeableCard } from './SwipeableCard'

type ItemT = EnhancedGitHubIssueOrPullRequest

export interface IssueOrPullRequestCardsProps {
  columnId: Column['id']
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: (() => void) | undefined
  getItemByNodeIdOrId: (nodeIdOrId: string) => ItemT | undefined
  isShowingOnlyBookmarks: boolean
  itemNodeIdOrIds: string[]
  lastFetchedSuccessfullyAt: string | undefined
  pointerEvents?: ViewProps['pointerEvents']
  refresh: EmptyCardsProps['refresh']
  swipeable: boolean
}

export const IssueOrPullRequestCards = React.memo(
  (props: IssueOrPullRequestCardsProps) => {
    const {
      columnId,
      errorMessage,
      fetchNextPage,
      getItemByNodeIdOrId,
      isShowingOnlyBookmarks,
      itemNodeIdOrIds,
      lastFetchedSuccessfullyAt,
      pointerEvents,
      refresh,
      swipeable,
    } = props

    const listRef = React.useRef<typeof OneList>(null)

    const dispatch = useDispatch()
    const store = useStore()

    const getItemKey = useCallback(
      (nodeIdOrId: DataItemT, index: number) => {
        return `issue-or-pr-card-${nodeIdOrId || index}`
      },
      [getItemByNodeIdOrId],
    )

    const loggedUsername = useReduxState(
      selectors.currentGitHubUsernameSelector,
    )!

    const {
      OverrideRender,
      data,
      fixedHeaderComponent,
      footer,
      getItemSize,
      getOwnerIsKnownByItemOrNodeIdOrId,
      header,
      itemSeparator,
      onVisibleItemsChanged,
      refreshControl,
      repoIsKnown,
      safeAreaInsets,
      visibleItemIndexesRef,
    } = useCardsProps({
      columnId,
      fetchNextPage,
      getItemByNodeIdOrId,
      itemNodeIdOrIds,
      lastFetchedSuccessfullyAt,
      refresh,
      type: 'issue_or_pr',
    })

    useCardsKeyboard(listRef, {
      columnId,
      getItemByNodeIdOrId,
      getOwnerIsKnownByItemOrNodeIdOrId,
      itemNodeIdOrIds:
        OverrideRender && OverrideRender.Component && OverrideRender.overlay
          ? []
          : itemNodeIdOrIds,
      repoIsKnown,
      type: 'issue_or_pr',
      visibleItemIndexesRef,
    })

    const renderItem = useCallback<
      NonNullable<OneListProps<DataItemT>['renderItem']>
    >(
      ({ item: nodeIdOrId, index }) => {
        const height = getItemSize(nodeIdOrId, index)

        if (swipeable) {
          return (
            <View style={{ height }}>
              <SwipeableCard
                type="issue_or_pr"
                columnId={columnId}
                nodeIdOrId={nodeIdOrId}
                ownerIsKnown={getOwnerIsKnownByItemOrNodeIdOrId(nodeIdOrId)}
                repoIsKnown={repoIsKnown}
              />
            </View>
          )
        }

        return (
          <ErrorBoundary>
            <View style={{ height }}>
              <IssueOrPullRequestCard
                repoIsKnown={repoIsKnown}
                ownerIsKnown={getOwnerIsKnownByItemOrNodeIdOrId(nodeIdOrId)}
                nodeIdOrId={nodeIdOrId}
                columnId={columnId}
              />
            </View>
          </ErrorBoundary>
        )
      },
      [getOwnerIsKnownByItemOrNodeIdOrId, repoIsKnown, swipeable],
    )

    const ListEmptyComponent = useMemo<
      NonNullable<OneListProps<DataItemT>['ListEmptyComponent']>
    >(
      () => () => {
        if (
          OverrideRender &&
          OverrideRender.Component &&
          OverrideRender.overlay
        )
          return null

        if (isShowingOnlyBookmarks) {
          return (
            <EmptyCards
              clearEmoji="bookmark"
              clearMessage="No bookmarks matching your filters"
              columnId={columnId}
              disableLoadingIndicator
              errorMessage={errorMessage}
              fetchNextPage={fetchNextPage}
              refresh={refresh}
            />
          )
        }

        const column = selectors.columnSelector(store.getState(), columnId)

        const maybeInvalidFilters = `${errorMessage || ''}`
          .toLowerCase()
          .startsWith('validation failed')
        const messageHasMoreDetails =
          `${errorMessage || ''}` !== 'validation failed'
        const emptyFilters =
          maybeInvalidFilters &&
          !getSearchQueryFromFilter('issue_or_pr', column && column.filters)

        if (maybeInvalidFilters) {
          return (
            <EmptyCards
              columnId={columnId}
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
                          columnId,
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
                          columnId,
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
            columnId={columnId}
            disableLoadingIndicator
            errorMessage={errorMessage}
            fetchNextPage={fetchNextPage}
            refresh={refresh}
          />
        )
      },
      [
        itemNodeIdOrIds.length ? undefined : columnId,
        itemNodeIdOrIds.length ? undefined : errorMessage,
        itemNodeIdOrIds.length ? undefined : fetchNextPage,
        itemNodeIdOrIds.length ? undefined : refresh,
        itemNodeIdOrIds.length ? undefined : loggedUsername,
        itemNodeIdOrIds.length ? undefined : isShowingOnlyBookmarks,
        itemNodeIdOrIds.length
          ? undefined
          : !!(
              OverrideRender &&
              OverrideRender.Component &&
              OverrideRender.overlay
            ),
      ],
    )

    if (OverrideRender && OverrideRender.Component && !OverrideRender.overlay)
      return <OverrideRender.Component />

    return (
      <View style={sharedStyles.flex}>
        {fixedHeaderComponent}

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
          forceRerenderOnRefChange={getItemByNodeIdOrId}
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
