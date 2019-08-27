import React, { useCallback, useMemo } from 'react'
import { View, ViewProps } from 'react-native'

import { Column, EnhancedGitHubNotification } from '@devhub/core'
import { useCardsKeyboard } from '../../hooks/use-cards-keyboard'
import { DataItemT, useCardsProps } from '../../hooks/use-cards-props'
import { ErrorBoundary } from '../../libs/bugsnag'
import { OneList, OneListProps } from '../../libs/one-list'
import { sharedStyles } from '../../styles/shared'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { NotificationCard, NotificationCardProps } from './NotificationCard'
import { SwipeableNotificationCard } from './SwipeableNotificationCard'

type ItemT = EnhancedGitHubNotification

export interface NotificationCardsProps
  extends Omit<
    NotificationCardProps,
    'cachedCardProps' | 'columnId' | 'notification'
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
  return `notification-card-${item.id}`
}

export const NotificationCards = React.memo((props: NotificationCardsProps) => {
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

  const {
    OverrideRenderComponent,
    data,
    firstVisibleItemIndexRef,
    footer,
    getItemSize,
    header,
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
    type: 'notifications',
  })

  useCardsKeyboard(listRef, {
    columnId: column.id,
    firstVisibleItemIndexRef,
    items,
    type: 'notifications',
  })

  const renderItem = useCallback<
    NonNullable<OneListProps<DataItemT<ItemT>>['renderItem']>
  >(
    ({ item: { cachedCardProps, height, item } }) => {
      if (swipeable) {
        return (
          <View style={{ height }}>
            <SwipeableNotificationCard
              cachedCardProps={cachedCardProps}
              columnId={column.id}
              notification={item}
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
            <NotificationCard
              cachedCardProps={cachedCardProps}
              columnId={column.id}
              notification={item}
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
      return (
        <EmptyCards
          clearMessage="No new notifications!"
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
    ],
  )

  if (OverrideRenderComponent) return <OverrideRenderComponent />

  return (
    <View style={sharedStyles.flex}>
      <OneList
        ref={listRef}
        key="notification-cards-list"
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
      />
    </View>
  )
})

NotificationCards.displayName = 'NotificationCards'
