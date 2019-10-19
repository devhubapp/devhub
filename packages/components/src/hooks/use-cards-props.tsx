import {
  activePlans,
  Column,
  ColumnSubscription,
  constants,
  EnhancedGitHubEvent,
  EnhancedItem,
  getDateSmallText,
  getOwnerAndRepoFormattedFilter,
  getUsernamesFromFilter,
} from '@devhub/core'
import React, { useCallback, useMemo, useRef } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import {
  getCardPropsForItem,
  getCardSizeForProps,
} from '../components/cards/BaseCard.shared'
import {
  CardsFooter,
  CardsFooterProps,
  getCardsFooterSize,
} from '../components/cards/CardsFooter'
import {
  CardsOwnerFilterBar,
  cardsOwnerFilterBarTotalHeight,
} from '../components/cards/CardsOwnerFilterBar'
import {
  cardSearchTotalHeight,
  CardsSearchHeader,
} from '../components/cards/CardsSearchHeader'
import {
  CardsWatchingOwnerFilterBar,
  cardsWatchingOwnerFilterBarTotalHeight,
} from '../components/cards/CardsWatchingOwnerFilterBar'
import { EmptyCards } from '../components/cards/EmptyCards'
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
import { sharedStyles } from '../styles/shared'
import { useReduxState } from './use-redux-state'

export type DataItemT<ItemT extends EnhancedItem> = ItemT['id']

export function useCardsProps<ItemT extends EnhancedItem>({
  column,
  columnIndex,
  fetchNextPage,
  getItemById,
  itemIds,
  lastFetchedSuccessfullyAt,
  ownerIsKnown: _ownerIsKnown,
  refresh,
  repoIsKnown: _repoIsKnown,
  type,
}: {
  column: Column | undefined
  columnIndex: number
  fetchNextPage: CardsFooterProps['fetchNextPage']
  getItemById: (id: ItemT['id']) => ItemT | undefined
  itemIds: Array<ItemT['id']> | undefined
  lastFetchedSuccessfullyAt: string | undefined
  ownerIsKnown: boolean
  refresh: CardsFooterProps['refresh']
  repoIsKnown: boolean
  type: ColumnSubscription['type']
}) {
  const visibleItemIndexesRef = useRef({ from: -1, to: -1 })

  const appSafeAreaInsets = useSafeArea()
  const { appOrientation } = useAppLayout()
  const dispatch = useDispatch()
  const plan = useReduxState(selectors.currentUserPlanSelector)

  const subtype = useReduxState(
    useCallback(
      state => {
        if (!column) return undefined

        const subscription = selectors.columnSubscriptionSelector(
          state,
          column.id,
        )
        return subscription && subscription.subtype
      },
      [column && column.id],
    ),
  )

  const isDashboard =
    subtype === 'USER_RECEIVED_EVENTS' ||
    subtype === 'USER_RECEIVED_PUBLIC_EVENTS'
  const isUserActivity =
    subtype === 'USER_EVENTS' || subtype === 'USER_PUBLIC_EVENTS'

  const isOverPlanColumnLimit = !!(
    plan && columnIndex + 1 > plan.featureFlags.columnsLimit
  )
  const isOverMaxColumnLimit = !!(
    columnIndex >= 0 && columnIndex + 1 > constants.COLUMNS_LIMIT
  )

  const { allIncludedOwners, allIncludedRepos } = useMemo(
    () => getOwnerAndRepoFormattedFilter(column && column.filters),
    [column && column.filters && column.filters.owners],
  )

  const includedUsernames =
    (column &&
      getUsernamesFromFilter(type, column.filters).includedUsernames) ||
    []
  const repoIsKnown = !!(_repoIsKnown || allIncludedRepos.length === 1)
  const ownerIsKnown = !!(
    _ownerIsKnown ||
    allIncludedOwners.length === 1 ||
    (isDashboard && includedUsernames.length === 1) ||
    repoIsKnown
  )

  const data: Array<DataItemT<ItemT>> = itemIds || []

  const getItemCardProps = useCallback(
    (item: ItemT) => {
      const event = item as EnhancedGitHubEvent

      return getCardPropsForItem(type, item, {
        ownerIsKnown:
          (isDashboard || isUserActivity) &&
          (event.type === 'ForkEvent' ||
            event.type === 'WatchEvent' ||
            // event.type === 'WatchEvent:OneUserMultipleRepos' ||
            event.type === 'MemberEvent')
            ? (() => {
                const repoOwnerName =
                  (event.repo &&
                    (event.repo.name ||
                      event.repo.full_name ||
                      (event.repo.owner && event.repo.owner.login))) ||
                  undefined
                if (!repoOwnerName) return _ownerIsKnown

                return !!(
                  includedUsernames.length === 1 &&
                  repoOwnerName.split('/')[0].toLowerCase() ===
                    includedUsernames[0].toLowerCase()
                )
              })()
            : ownerIsKnown,
        plan,
        repoIsKnown,
      })
    },
    [
      isDashboard,
      isUserActivity,
      includedUsernames.length === 1,
      includedUsernames[0],
      ownerIsKnown,
    ],
  )

  const getItemSize = useCallback<
    NonNullable<OneListProps<DataItemT<ItemT>>['getItemSize']>
  >(
    id => {
      const item = getItemById(id)
      if (!item) return 0

      const itemCardProps = getItemCardProps(item)
      return getCardSizeForProps(itemCardProps) || 0
    },
    [getItemById],
  )

  const itemSeparator = undefined

  const header = useMemo<OneListProps<DataItemT<ItemT>>['header']>(() => {
    const renderOwnerFilterBar = !!(
      column &&
      (data || []).length &&
      (!_ownerIsKnown ||
        (column.type === 'issue_or_pr' && includedUsernames.length > 1)) &&
      !isDashboard
    )

    const renderWatchingOwnerFilterBar = !!(
      column &&
      column.type === 'activity' &&
      isDashboard
    )

    const size = column
      ? cardSearchTotalHeight +
        (renderOwnerFilterBar ? cardsOwnerFilterBarTotalHeight : 0) +
        (renderWatchingOwnerFilterBar
          ? cardsWatchingOwnerFilterBarTotalHeight
          : 0) +
        columnLoadingIndicatorSize
      : 0

    return {
      size,
      sticky: false,
      Component: () => (
        <View style={[sharedStyles.fullWidth, { height: size }]}>
          {!!column && (
            <>
              <View style={[sharedStyles.relative, sharedStyles.fullWidth]}>
                <CardsSearchHeader
                  key={`cards-search-header-column-${column.id}`}
                  columnId={column.id}
                />

                <ColumnLoadingIndicator columnId={column.id} />
              </View>

              {!!renderOwnerFilterBar && (
                <CardsOwnerFilterBar
                  key={`cards-owner-filter-bar-column-${column.id}`}
                  columnId={column.id}
                />
              )}

              {!!renderWatchingOwnerFilterBar && (
                <CardsWatchingOwnerFilterBar
                  key={`cards-watching-owner-filter-bar-column-${column.id}`}
                  columnId={column.id}
                />
              )}
            </>
          )}
        </View>
      ),
    }
  }, [
    column && column.id,
    column && column.type,
    _ownerIsKnown,
    !!(data || []).length,
  ])

  const cardsFooterProps: CardsFooterProps = {
    clearedAt: column && column.filters && column.filters.clearedAt,
    columnId: (column && column.id)!,
    fetchNextPage,
    isEmpty: !((data || []).length > 0),
    refresh,
  }
  const sticky = !!(!fetchNextPage && cardsFooterProps.clearedAt)
  // && // TODO
  // itemLayouts[itemLayouts.length - 1] &&
  // itemLayouts[itemLayouts.length - 1]!.offset +
  //   itemLayouts[itemLayouts.length - 1]!.length <
  //   windowHeight - ((header && header.size) || 0) - columnHeaderHeight

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
            errorMessage={`You have reached the limit of ${constants.COLUMNS_LIMIT} columns. This is to maintain a healthy usage of the GitHub API.`}
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
    itemSeparator,
    onVisibleItemsChanged,
    refreshControl,
    safeAreaInsets,
    visibleItemIndexesRef,
  }
}
