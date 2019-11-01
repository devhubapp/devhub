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
import { CardsSearchHeader } from '../components/cards/CardsSearchHeader'
import {
  CardsWatchingOwnerFilterBar,
  cardsWatchingOwnerFilterBarTotalHeight,
} from '../components/cards/CardsWatchingOwnerFilterBar'
import { EmptyCards } from '../components/cards/EmptyCards'
import { ColumnLoadingIndicator } from '../components/columns/ColumnLoadingIndicator'
import { Button } from '../components/common/Button'
import { QuickFeedbackRow } from '../components/common/QuickFeedbackRow'
import { RefreshControl } from '../components/common/RefreshControl'
import { Spacer } from '../components/common/Spacer'
import { useAppLayout } from '../components/context/LayoutContext'
import { OneListProps } from '../libs/one-list'
import { useSafeArea } from '../libs/safe-area-view'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { sharedStyles } from '../styles/shared'
import { contentPadding } from '../styles/variables'
import { useColumn } from './use-column'
import { useReduxState } from './use-redux-state'

export type DataItemT = string

export function useCardsProps<ItemT extends EnhancedItem>({
  columnId,
  fetchNextPage,
  getItemByNodeIdOrId,
  itemNodeIdOrIds,
  lastFetchedSuccessfullyAt,
  refresh,
  type,
}: {
  columnId: Column['id'] | undefined
  fetchNextPage: CardsFooterProps['fetchNextPage']
  getItemByNodeIdOrId: (nodeIdOrId: string) => ItemT | undefined
  itemNodeIdOrIds: string[] | undefined
  lastFetchedSuccessfullyAt: string | undefined
  refresh: CardsFooterProps['refresh']
  type: ColumnSubscription['type']
}) {
  const visibleItemIndexesRef = useRef({ from: -1, to: -1 })

  const appSafeAreaInsets = useSafeArea()
  const { appOrientation } = useAppLayout()
  const { column, columnIndex, headerDetails } = useColumn(columnId || '')

  const dispatch = useDispatch()
  const plan = useReduxState(selectors.currentUserPlanSelector)
  const isPlanExpired = useReduxState(selectors.isPlanExpiredSelector)

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

  const _ownerIsKnown = headerDetails && headerDetails.ownerIsKnown
  const _repoIsKnown = headerDetails && headerDetails.repoIsKnown

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

  const data: DataItemT[] = itemNodeIdOrIds || []

  const getOwnerIsKnownByItemOrNodeIdOrId = useCallback(
    (itemOrNodeIdOrId: string | ItemT | undefined): boolean => {
      if (!itemOrNodeIdOrId) return false

      const item =
        typeof itemOrNodeIdOrId === 'string'
          ? getItemByNodeIdOrId(itemOrNodeIdOrId)
          : itemOrNodeIdOrId
      if (!item) return false

      const event = item as EnhancedGitHubEvent

      return (isDashboard || isUserActivity) &&
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
            if (!repoOwnerName) return !!_ownerIsKnown

            return !!(
              includedUsernames.length === 1 &&
              repoOwnerName.split('/')[0].toLowerCase() ===
                includedUsernames[0].toLowerCase()
            )
          })()
        : ownerIsKnown
    },
    [
      getItemByNodeIdOrId,
      includedUsernames.length === 1,
      includedUsernames[0],
      isDashboard,
      isUserActivity,
      ownerIsKnown,
    ],
  )

  const getItemSize = useCallback<
    NonNullable<OneListProps<DataItemT>['getItemSize']>
  >(
    nodeIdOrId => {
      const item = getItemByNodeIdOrId(nodeIdOrId)
      if (!item) return 0

      const itemCardProps = getCardPropsForItem(type, item, {
        ownerIsKnown: getOwnerIsKnownByItemOrNodeIdOrId(item),
        plan,
        repoIsKnown,
      })
      if (!itemCardProps) return 0

      return getCardSizeForProps(itemCardProps)
    },
    [
      getCardSizeForProps,
      getOwnerIsKnownByItemOrNodeIdOrId,
      plan,
      repoIsKnown,
      type,
    ],
  )

  const itemSeparator = undefined

  const fixedHeaderComponent = useMemo(
    () =>
      !!column && (
        <View style={[sharedStyles.relative, sharedStyles.fullWidth]}>
          <CardsSearchHeader
            key={`cards-search-header-column-${column.id}`}
            columnId={column.id}
          />

          <ColumnLoadingIndicator columnId={column.id} />
        </View>
      ),
    [column && column.id],
  )

  const header = useMemo<OneListProps<DataItemT>['header']>(() => {
    const renderOwnerFilterBar = !!(
      column &&
      (data || []).length &&
      (!_ownerIsKnown ||
        (column.type === 'issue_or_pr' && includedUsernames.length > 1)) &&
      !isDashboard
    )

    const renderWatchingOwnerFilterBar = !!(
      column &&
      (data || []).length &&
      column.type === 'activity' &&
      isDashboard
    )

    const size = column
      ? (renderOwnerFilterBar ? cardsOwnerFilterBarTotalHeight : 0) +
        (renderWatchingOwnerFilterBar
          ? cardsWatchingOwnerFilterBarTotalHeight
          : 0)
      : 0

    return {
      size,
      sticky: false,
      Component: () => (
        <View style={[sharedStyles.fullWidth, { height: size }]}>
          {!!column && (
            <>
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

  const footer = useMemo<OneListProps<DataItemT>['footer']>(() => {
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

  const safeAreaInsets: OneListProps<DataItemT>['safeAreaInsets'] = useMemo(
    () => ({
      bottom: appOrientation === 'landscape' ? appSafeAreaInsets.bottom : 0,
    }),
    [appOrientation, appSafeAreaInsets.bottom],
  )

  const onVisibleItemsChanged = useCallback<
    NonNullable<OneListProps<DataItemT>['onVisibleItemsChanged']>
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
            ? `Last updated ${getDateSmallText(lastFetchedSuccessfullyAt, {
                includeExactTime: true,
              })}`
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

    if (isPlanExpired) {
      return {
        Component: () => (
          <EmptyCards
            columnId={column.id}
            emoji="lock"
            errorButtonView={
              <View>
                <Button
                  analyticsCategory="plan_expired"
                  analyticsLabel="select_a_plan_button"
                  children="Select a plan"
                  onPress={() => {
                    dispatch(
                      actions.pushModal({
                        name: 'PRICING',
                        params: {
                          highlightFeature: 'columnsLimit',
                        },
                      }),
                    )
                  }}
                />

                <Spacer height={contentPadding} />

                <QuickFeedbackRow />
              </View>
            }
            errorMessage="You need a paid plan to keep using DevHub."
            errorTitle="Free trial expired"
            fetchNextPage={undefined}
            loadState="error"
            refresh={undefined}
          />
        ),
        overlay: false,
      }
    }

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
        Component: () =>
          plan && plan.featureFlags.columnsLimit ? (
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
              errorMessage={`You have exceeded the limit of ${plan.featureFlags.columnsLimit} columns.`}
              errorTitle="Limit exceeded"
              fetchNextPage={undefined}
              loadState="error"
              refresh={undefined}
            />
          ) : (
            <EmptyCards
              columnId={column.id}
              emoji="lock"
              errorButtonView={
                <Button
                  analyticsLabel="select_a_plan_button"
                  analyticsCategory="invalid_plan"
                  children="Select a plan"
                  onPress={() => {
                    dispatch(
                      actions.pushModal({
                        name: 'PRICING',
                        params: {
                          highlightFeature: 'columnsLimit',
                        },
                      }),
                    )
                  }}
                />
              }
              errorMessage="You need a paid plan to keep using DevHub."
              errorTitle="Upgrade to a paid plan"
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
    isPlanExpired,
  ])

  return {
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
  }
}
