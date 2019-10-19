import React, { useCallback, useMemo } from 'react'
import { View, ViewProps } from 'react-native'

import { Column, EnhancedGitHubNotification } from '@devhub/core'
import { useCardsKeyboard } from '../../hooks/use-cards-keyboard'
import { DataItemT, useCardsProps } from '../../hooks/use-cards-props'
import { BlurView } from '../../libs/blur-view/BlurView'
import { ErrorBoundary } from '../../libs/bugsnag'
import { OneList, OneListProps } from '../../libs/one-list'
import { sharedStyles } from '../../styles/shared'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { NotificationCard, NotificationCardProps } from './NotificationCard'
import { SwipeableCard } from './SwipeableCard'

type ItemT = EnhancedGitHubNotification

export interface NotificationCardsProps
  extends Omit<NotificationCardProps, 'columnId' | 'notification'> {
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

export const NotificationCards = React.memo((props: NotificationCardsProps) => {
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

  const getItemKey = useCallback(
    (id: DataItemT<ItemT>, index: number) => {
      const item = getItemById(id)
      return `notification-card-${(item && item.id) || index}`
    },
    [getItemById],
  )

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
    column,
    columnIndex,
    fetchNextPage,
    getItemById,
    itemIds,
    lastFetchedSuccessfullyAt,
    ownerIsKnown,
    refresh,
    repoIsKnown,
    type: 'notifications',
  })

  useCardsKeyboard(listRef, {
    columnId: column.id,
    getItemById,
    itemIds:
      OverrideRender && OverrideRender.Component && OverrideRender.overlay
        ? []
        : itemIds,
    ownerIsKnown,
    repoIsKnown,
    type: 'notifications',
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
              type="notifications"
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
            <NotificationCard
              columnId={column.id}
              notification={item}
              ownerIsKnown={ownerIsKnown}
              repoIsKnown={repoIsKnown}
            />
          </View>
        </ErrorBoundary>
      )
    },
    [getItemById, ownerIsKnown, repoIsKnown, swipeable],
  )

  const ListEmptyComponent = useMemo<
    NonNullable<OneListProps<DataItemT<ItemT>>['ListEmptyComponent']>
  >(
    () => () => {
      return (
        <EmptyCards
          clearMessage="No new notifications!"
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
})

NotificationCards.displayName = 'NotificationCards'
