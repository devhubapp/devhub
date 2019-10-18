import { Column, EnhancedGitHubNotification } from '@devhub/core'
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
import { Button } from '../common/Button'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { GenericMessageWithButtonView } from './GenericMessageWithButtonView'
import { NotificationCard, NotificationCardProps } from './NotificationCard'
import { SwipeableCard } from './SwipeableCard'

type ItemT = EnhancedGitHubNotification

export interface NotificationCardsProps {
  columnId: Column['id']
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: (() => void) | undefined
  getItemByNodeIdOrId: (nodeIdOrId: string) => ItemT | undefined
  itemNodeIdOrIds: string[]
  lastFetchedSuccessfullyAt: string | undefined
  pointerEvents?: ViewProps['pointerEvents']
  refresh: EmptyCardsProps['refresh']
  swipeable: boolean
}

export const NotificationCards = React.memo((props: NotificationCardsProps) => {
  const {
    columnId,
    errorMessage,
    fetchNextPage,
    getItemByNodeIdOrId,
    itemNodeIdOrIds,
    lastFetchedSuccessfullyAt,
    pointerEvents,
    refresh,
    swipeable,
  } = props

  const listRef = React.useRef<typeof OneList>(null)

  const getItemKey = useCallback(
    (nodeIdOrId: DataItemT, index: number) => {
      return `notification-card-${nodeIdOrId || index}`
    },
    [getItemByNodeIdOrId],
  )

  const dispatch = useDispatch()

  const loadState = useReduxState(
    state => selectors.notificationsState(state).loadingState,
  )
  const lastFetchedCount = useReduxState(
    state => selectors.notificationsState(state).lastFetchedCount,
  )
  const lastFetchedAllSuccessAt = useReduxState(
    state => selectors.notificationsState(state).lastFetchedAllSuccessAt,
  )
  const latestPreventRefetchExisting = useReduxState(
    state => selectors.notificationsState(state).latestPreventRefetchExisting,
  )
  const pendingRequestsToShow = useReduxState(state => {
    const lastFetchedSuccessAt = selectors.notificationsState(state)
      .lastFetchedSuccessAt
    const latestWillFetchMore = selectors.notificationsState(state)
      .latestWillFetchMore
    const pendingEnhancementRequestsCount = selectors.notificationsState(state)
      .pendingEnhancementRequestsCount

    return pendingEnhancementRequestsCount &&
      (!latestWillFetchMore ||
        (lastFetchedSuccessAt &&
          Date.now() - new Date(lastFetchedSuccessAt).valueOf() > 30 * 1000))
      ? pendingEnhancementRequestsCount
      : undefined
  })

  const {
    OverrideRender,
    data,
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
    type: 'notifications',
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
    type: 'notifications',
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
              type="notifications"
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
            <NotificationCard
              columnId={columnId}
              nodeIdOrId={nodeIdOrId}
              ownerIsKnown={getOwnerIsKnownByItemOrNodeIdOrId(nodeIdOrId)}
              repoIsKnown={repoIsKnown}
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
      return (
        <EmptyCards
          clearMessage="No new notifications!"
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
    ],
  )

  if (OverrideRender && OverrideRender.Component && !OverrideRender.overlay)
    return <OverrideRender.Component />

  return (
    <View style={sharedStyles.flex}>
      <OneList
        ref={listRef}
        key="notification-cards-list"
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

      {loadState === 'loading-all' && (
        <View>
          <GenericMessageWithButtonView
            buttonView={
              <Button
                children=""
                loading
                onPress={() => {
                  dispatch(actions.fetchNotificationsAbort())
                }}
              />
            }
            emoji="bell"
            subtitle={`${
              lastFetchedAllSuccessAt || latestPreventRefetchExisting
                ? ''
                : 'This will happen only once. '
            }It may take a couple minutes if you have thousands of ${
              latestPreventRefetchExisting ? 'notifications' : 'them'
            }.${lastFetchedCount ? ` (${lastFetchedCount})` : ''}${
              pendingRequestsToShow
                ? `\nPending requests: ${pendingRequestsToShow}`
                : ''
            }`}
            title={
              latestPreventRefetchExisting
                ? 'Syncing unread status...'
                : 'Fetching all notifications...'
            }
          />
        </View>
      )}
    </View>
  )
})

NotificationCards.displayName = 'NotificationCards'
