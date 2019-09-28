import {
  activePlans,
  Column,
  ColumnSubscription,
  constants,
  EnhancedItem,
  getDateSmallText,
} from '@devhub/core'
import React, { useCallback, useMemo, useRef } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

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
import { columnHeaderHeight } from '../components/columns/ColumnHeader'
import {
  ColumnLoadingIndicator,
  columnLoadingIndicatorSize,
} from '../components/columns/ColumnLoadingIndicator'
import { Button } from '../components/common/Button'
import { RefreshControl } from '../components/common/RefreshControl'
import { useAppLayout } from '../components/context/LayoutContext'
import { OneListProps } from '../libs/one-list'
import { useSafeArea } from '../libs/safe-area-view'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { FlatListItemLayout } from '../utils/types'
import { useDimensions } from './use-dimensions'
import { usePreviousRef } from './use-previous-ref'
import { useReduxState } from './use-redux-state'

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
  lastFetchedSuccessfullyAt,
  ownerIsKnown,
  refresh,
  repoIsKnown,
  type,
}: {
  column: Column | undefined
  columnIndex: number
  fetchNextPage: CardsFooterProps['fetchNextPage']
  items: ItemT[] | undefined
  lastFetchedSuccessfullyAt: string | undefined
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
  const { height: windowHeight } = useDimensions('height')

  const dispatch = useDispatch()
  const plan = useReduxState(selectors.currentUserPlanSelector)

  const isOverPlanColumnLimit = !!(
    plan && columnIndex + 1 > plan.featureFlags.columnsLimit
  )
  const isOverMaxColumnLimit = !!(
    columnIndex >= 0 && columnIndex + 1 > constants.COLUMNS_LIMIT
  )

  const previousOwnerIsKnownRef = usePreviousRef(ownerIsKnown)
  const previousPlanRef = usePreviousRef(plan)
  const previousRepoIsKnownRef = usePreviousRef(repoIsKnown)
  const itemCardProps = useMemo<Array<BaseCardProps | undefined>>(() => {
    const newCacheMap = new WeakMap()

    if (!(items && items.length)) {
      cardPropsCacheMapRef.current = newCacheMap
      return []
    }

    if (
      previousOwnerIsKnownRef.current !== ownerIsKnown ||
      previousPlanRef.current !== plan ||
      previousRepoIsKnownRef.current !== repoIsKnown
    ) {
      cardPropsCacheMapRef.current = newCacheMap
    }

    const result = items.map<BaseCardProps>(item => {
      const cached = cardPropsCacheMapRef.current.get(item)
      const value =
        cached ||
        getCardPropsForItem(type, item, { ownerIsKnown, plan, repoIsKnown })
      newCacheMap.set(item, value)

      return value
    })

    cardPropsCacheMapRef.current = newCacheMap

    return result
  }, [items, ownerIsKnown, plan, repoIsKnown])

  const itemLayouts = useMemo<Array<FlatListItemLayout | undefined>>(() => {
    const newCacheMap = new WeakMap()

    if (!(items && items.length)) {
      sizeCacheMapRef.current = newCacheMap
      return []
    }

    if (
      previousOwnerIsKnownRef.current !== ownerIsKnown ||
      previousPlanRef.current !== plan ||
      previousRepoIsKnownRef.current !== repoIsKnown
    ) {
      sizeCacheMapRef.current = newCacheMap
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
  }, [itemCardProps, items, ownerIsKnown, plan, repoIsKnown])

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
  }, [items, itemCardProps])

  const itemSeparator = undefined

  const header = useMemo<OneListProps<DataItemT<ItemT>>['header']>(() => {
    return {
      size: cardSearchTotalHeight + columnLoadingIndicatorSize,
      sticky: false,
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
  const sticky = !!(
    !fetchNextPage &&
    cardsFooterProps.clearedAt &&
    itemLayouts[itemLayouts.length - 1] &&
    itemLayouts[itemLayouts.length - 1]!.offset +
      itemLayouts[itemLayouts.length - 1]!.length <
      windowHeight - ((header && header.size) || 0) - columnHeaderHeight
  )

  const footer = useMemo<OneListProps<DataItemT<ItemT>>['footer']>(() => {
    if (isOverMaxColumnLimit || isOverPlanColumnLimit) return undefined

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
    isOverMaxColumnLimit,
    isOverPlanColumnLimit,
    sticky,
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
        intervalRefresh={lastFetchedSuccessfullyAt}
        onRefresh={refresh}
        refreshing={false}
        title={
          lastFetchedSuccessfullyAt
            ? `Last updated ${getDateSmallText(
                lastFetchedSuccessfullyAt,
                true,
              )}`
            : 'Pull to refresh'
        }
      />
    ),
    [lastFetchedSuccessfullyAt, refresh],
  )

  const OverrideRender = useMemo<{
    Component: React.ComponentType | undefined
    overlay?: boolean
  }>(() => {
    if (!(column && column.id)) return { Component: undefined, overlay: false }

    if (isOverMaxColumnLimit) {
      return {
        Component: () => (
          <EmptyCards
            columnId={column.id}
            errorMessage={`You have reached the limit of ${
              constants.COLUMNS_LIMIT
            } columns. This is to maintain a healthy usage of the GitHub API.`}
            errorTitle="Too many columns"
            fetchNextPage={undefined}
            loadState="error"
            refresh={undefined}
          />
        ),
        overlay: false,
      }
    }

    if (isOverPlanColumnLimit) {
      return {
        Component: () => (
          <EmptyCards
            columnId={column.id}
            emoji="rocket"
            errorButtonView={
              <Button
                analyticsLabel="unlock_more_columns_button"
                children="Unlock more columns"
                onPress={() => {
                  const nextPlan = activePlans.find(
                    p => p.featureFlags.columnsLimit > columnIndex + 1,
                  )
                  dispatch(
                    actions.pushModal({
                      name: 'PRICING',
                      params: {
                        highlightFeature: 'columnsLimit',
                        initialSelectedPlanId: nextPlan && nextPlan.id,
                      },
                    }),
                  )
                }}
              />
            }
            errorMessage={`You have exceeded the limit of ${
              plan!.featureFlags.columnsLimit
            } columns.`}
            errorTitle="Limit exceeded"
            fetchNextPage={undefined}
            loadState="error"
            refresh={undefined}
          />
        ),
        overlay: true,
      }
    }

    return { Component: undefined, overlay: false }
  }, [
    column && column.id,
    columnIndex,
    isOverMaxColumnLimit,
    isOverPlanColumnLimit,
  ])

  return {
    OverrideRender,
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
