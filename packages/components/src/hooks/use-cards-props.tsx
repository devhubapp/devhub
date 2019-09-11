import React, { useCallback, useMemo, useRef } from 'react'
import { View } from 'react-native'

import {
  Column,
  ColumnSubscription,
  constants,
  EnhancedItem,
  getDateSmallText,
} from '@devhub/core'
import {
  BaseCardProps,
  getCardPropsForItem,
  getCardSizeForProps,
} from '../components/cards/BaseCard.shared'
import {
  CardsFooter,
  CardsFooterProps,
  getCardsFooterSize,
} from '../components/cards/CardsFooter'
import {
  cardSearchTotalHeight,
  CardsSearchHeader,
} from '../components/cards/CardsSearchHeader'
import { EmptyCards } from '../components/cards/EmptyCards'
import { cardItemSeparatorSize } from '../components/cards/partials/CardItemSeparator'
import {
  ColumnLoadingIndicator,
  columnLoadingIndicatorSize,
} from '../components/columns/ColumnLoadingIndicator'
import { RefreshControl } from '../components/common/RefreshControl'
import { useAppLayout } from '../components/context/LayoutContext'
import { OneListProps } from '../libs/one-list'
import { useSafeArea } from '../libs/safe-area-view'
import { FlatListItemLayout } from '../utils/types'

export interface DataItemT<ItemT extends EnhancedItem> {
  cachedCardProps: BaseCardProps
  height: number
  item: ItemT
}

export function useCardsProps<ItemT extends EnhancedItem>({
  column,
  columnIndex,
  fetchNextPage,
  items,
  lastFetchedAt,
  ownerIsKnown,
  refresh,
  repoIsKnown,
  type,
}: {
  column: Column | undefined
  columnIndex: number
  fetchNextPage: CardsFooterProps['fetchNextPage']
  items: ItemT[] | undefined
  lastFetchedAt: string | undefined
  ownerIsKnown: boolean
  refresh: CardsFooterProps['refresh']
  repoIsKnown: boolean
  type: ColumnSubscription['type']
}) {
  const cardPropsCacheMapRef = useRef(
    new WeakMap<EnhancedItem, BaseCardProps>(),
  )
  const sizeCacheMapRef = useRef(new WeakMap<EnhancedItem, number>())
  const visibleItemIndexesRef = useRef({ from: -1, to: -1 })

  const appSafeAreaInsets = useSafeArea()
  const { appOrientation } = useAppLayout()

  const itemCardProps = useMemo<Array<BaseCardProps | undefined>>(() => {
    const newCacheMap = new WeakMap()

    if (!(items && items.length)) {
      cardPropsCacheMapRef.current = newCacheMap
      return []
    }

    const result = items.map<BaseCardProps>(item => {
      const cached = cardPropsCacheMapRef.current.get(item)
      const value =
        cached || getCardPropsForItem(type, item, { ownerIsKnown, repoIsKnown })
      newCacheMap.set(item, value)

      return value
    })

    cardPropsCacheMapRef.current = newCacheMap

    return result
  }, [items, ownerIsKnown, repoIsKnown])

  const itemLayouts = useMemo<Array<FlatListItemLayout | undefined>>(() => {
    const newCacheMap = new WeakMap()

    if (!(items && items.length)) {
      sizeCacheMapRef.current = newCacheMap
      return []
    }

    let totalOffset = 0
    const result = items.map<FlatListItemLayout>((item, index) => {
      const cached = sizeCacheMapRef.current.get(item)
      const value = cached || getCardSizeForProps(itemCardProps[index]!) || 0
      newCacheMap.set(item, value)

      const offset = totalOffset
      totalOffset += value + cardItemSeparatorSize

      return {
        index,
        offset,
        length: value,
      }
    })

    sizeCacheMapRef.current = newCacheMap

    return result
  }, [itemCardProps, items, ownerIsKnown, repoIsKnown])

  const getItemSize = useCallback<
    NonNullable<OneListProps<any>['getItemSize']>
  >((_, index) => (itemLayouts[index] && itemLayouts[index]!.length) || 0, [
    items,
    itemLayouts,
  ])

  const data = useMemo<Array<DataItemT<ItemT>>>(() => {
    return (items || []).map((item, index) => ({
      cachedCardProps: itemCardProps[index]!,
      height: getItemSize(undefined, index),
      item,
    }))
  }, [items])

  const itemSeparator = undefined

  const header = useMemo<OneListProps<DataItemT<ItemT>>['header']>(() => {
    return {
      size: cardSearchTotalHeight + columnLoadingIndicatorSize,
      sticky: true,
      Component: () => (
        <View>
          {!!column && (
            <>
              <CardsSearchHeader
                key={`cards-search-header-column-${column.id}`}
                columnId={column.id}
              />

              <ColumnLoadingIndicator columnId={column.id} />
            </>
          )}
        </View>
      ),
    }
  }, [column && column.id])

  const cardsFooterProps: CardsFooterProps = {
    clearedAt: column && column.filters && column.filters.clearedAt,
    columnId: (column && column.id)!,
    fetchNextPage,
    isEmpty: !(items && items.length > 0),
    refresh,
  }
  const footer = useMemo<OneListProps<DataItemT<ItemT>>['footer']>(() => {
    const sticky =
      !cardsFooterProps.fetchNextPage && !!cardsFooterProps.clearedAt

    return {
      size: getCardsFooterSize({
        clearedAt: cardsFooterProps.clearedAt,
        hasFetchNextPage: !!cardsFooterProps.fetchNextPage,
        isEmpty: cardsFooterProps.isEmpty,
      }),
      sticky,
      Component: () => <CardsFooter {...cardsFooterProps} />,
    }
  }, [
    cardsFooterProps.clearedAt,
    cardsFooterProps.columnId,
    cardsFooterProps.fetchNextPage,
    cardsFooterProps.isEmpty,
    cardsFooterProps.refresh,
  ])

  const safeAreaInsets: OneListProps<
    DataItemT<ItemT>
  >['safeAreaInsets'] = useMemo(
    () => ({
      bottom: appOrientation === 'landscape' ? appSafeAreaInsets.bottom : 0,
    }),
    [appOrientation, appSafeAreaInsets.bottom],
  )

  const onVisibleItemsChanged = useCallback<
    NonNullable<OneListProps<DataItemT<ItemT>>['onVisibleItemsChanged']>
  >((from, to) => {
    visibleItemIndexesRef.current = { from, to }
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

  const isOverColumnLimit = !!(
    columnIndex >= 0 && columnIndex + 1 > constants.COLUMNS_LIMIT
  )
  const OverrideRenderComponent = useMemo<
    React.ComponentType | undefined
  >(() => {
    if (!column) return undefined

    if (isOverColumnLimit) {
      return () => (
        <EmptyCards
          columnId={column.id}
          errorMessage={`You have reached the limit of ${
            constants.COLUMNS_LIMIT
          } columns. This is to maintain a healthy usage of the GitHub API.`}
          errorTitle="Too many columns"
          fetchNextPage={undefined}
          refresh={undefined}
        />
      )
    }

    return undefined
  }, [column, isOverColumnLimit])

  return {
    OverrideRenderComponent,
    data,
    footer,
    getItemSize,
    header,
    itemCardProps,
    itemSeparator,
    onVisibleItemsChanged,
    refreshControl,
    safeAreaInsets,
    visibleItemIndexesRef,
  }
}
