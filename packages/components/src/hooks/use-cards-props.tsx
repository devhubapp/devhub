import {
  activePaidPlans,
  activePlans,
  Column,
  ColumnSubscription,
  constants,
  EnhancedGitHubEvent,
  EnhancedItem,
  getDateSmallText,
  getOwnerAndRepoFormattedFilter,
  getUsernamesFromFilter,
  isPlanStatusValid,
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
import { ButtonLink } from '../components/common/ButtonLink'
import { QuickFeedbackRow } from '../components/common/QuickFeedbackRow'
import { RefreshControl } from '../components/common/RefreshControl'
import { useAppLayout } from '../components/context/LayoutContext'
import { OneListProps } from '../libs/one-list'
import { useSafeArea } from '../libs/safe-area-view'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { sharedStyles } from '../styles/shared'
import { useColumn } from './use-column'
import { useReduxState } from './use-redux-state'

export type DataItemT = string

export function useCardsProps<ItemT extends EnhancedItem>({
  columnId,
  fetchNextPage,
  getItemByNodeIdOrId,
  itemNodeIdOrIds,
  lastFetchSuccessAt,
  refresh,
  type,
}: {
  columnId: Column['id'] | undefined
  fetchNextPage: CardsFooterProps['fetchNextPage']
  getItemByNodeIdOrId: (nodeIdOrId: string) => ItemT | undefined
  itemNodeIdOrIds: string[] | undefined
  lastFetchSuccessAt: string | undefined
  refresh: CardsFooterProps['refresh']
  type: ColumnSubscription['type']
}) {
  const visibleItemIndexesRef = useRef({ from: -1, to: -1 })

  const appSafeAreaInsets = useSafeArea()
  const { appOrientation } = useAppLayout()
  const {
    column,
    columnIndex,
    headerDetails,
    isOverMaxColumnLimit,
    isOverPlanColumnLimit,
  } = useColumn(columnId || '')

  const dispatch = useDispatch()
  const appToken = useReduxState(selectors.appTokenSelector)
  const plan = useReduxState(selectors.currentUserPlanSelector)
  const isPlanExpired = useReduxState(selectors.isPlanExpiredSelector)

  const mainSubscription = useReduxState(
    useCallback(
      state =>
        selectors.createColumnSubscriptionSelector()(state, columnId || ''),
      [columnId],
    ),
  )

  const subtype = (mainSubscription && mainSubscription.subtype) || undefined

  const _ownerIsKnown = headerDetails && headerDetails.ownerIsKnown
  const _repoIsKnown = headerDetails && headerDetails.repoIsKnown

  const isDashboard =
    subtype === 'USER_RECEIVED_EVENTS' ||
    subtype === 'USER_RECEIVED_PUBLIC_EVENTS'
  const isUserActivity =
    subtype === 'USER_EVENTS' || subtype === 'USER_PUBLIC_EVENTS'

  const { allIncludedOwners, allIncludedRepos } = useMemo(
    () => getOwnerAndRepoFormattedFilter(column && column.filters),
    [column && column.filters && column.filters.owners],
  )

  const allUsernamesFromFilter =
    (column && getUsernamesFromFilter(type, column.filters).allUsernames) || []

  const allOwnersFromFilter =
    (column &&
      getUsernamesFromFilter(type, column.filters, { whitelist: ['owner'] })
        .allUsernames) ||
    []

  const allWatchingFromFilter =
    (column &&
      getUsernamesFromFilter(type, column.filters, { whitelist: ['watching'] })
        .allUsernames) ||
    []

  const repoIsKnown = !!(_repoIsKnown || allIncludedRepos.length === 1)
  const ownerIsKnown = !!(
    _ownerIsKnown ||
    allIncludedOwners.length === 1 ||
    (isDashboard && allUsernamesFromFilter.length === 1) ||
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
              allUsernamesFromFilter.length === 1 &&
              repoOwnerName.split('/')[0].toLowerCase() ===
                allUsernamesFromFilter[0].toLowerCase()
            )
          })()
        : ownerIsKnown
    },
    [
      getItemByNodeIdOrId,
      allUsernamesFromFilter.length === 1,
      allUsernamesFromFilter[0],
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

      const itemCardProps = getCardPropsForItem(type, columnId || '', item, {
        ownerIsKnown: getOwnerIsKnownByItemOrNodeIdOrId(item),
        plan,
        repoIsKnown,
      })
      if (!itemCardProps) return 0

      return getCardSizeForProps(itemCardProps)
    },
    [
      columnId,
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
      ((data || []).length || allOwnersFromFilter.length) &&
      (!_ownerIsKnown ||
        (column.type === 'issue_or_pr' && allUsernamesFromFilter.length > 1)) &&
      !isDashboard
    )

    const renderWatchingOwnerFilterBar = !!(
      column &&
      ((data || []).length || allWatchingFromFilter.length) &&
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
    topSpacing: (!data.length && header && header.size) || 0,
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
        topSpacing: cardsFooterProps.topSpacing,
      }),
      sticky,
      Component: () => <CardsFooter {...cardsFooterProps} />,
    }
  }, [
    (!data.length && header && header.size) || 0,
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
        intervalRefresh={lastFetchSuccessAt}
        onRefresh={refresh}
        refreshing={false}
        title={
          lastFetchSuccessAt
            ? `Last updated ${getDateSmallText(lastFetchSuccessAt, {
                includeExactTime: true,
              })}`
            : 'Pull to refresh'
        }
      />
    ),
    [lastFetchSuccessAt, refresh],
  )

  const OverrideRender = useMemo<{
    Component: React.ComponentType | undefined
    overlay?: boolean
  }>(() => {
    if (!(column && column.id)) return { Component: undefined, overlay: false }

    if (isPlanExpired && !(plan && plan.featureFlags.columnsLimit)) {
      return {
        Component: () => (
          <EmptyCards
            columnId={column.id}
            emoji="lock"
            errorButtonView={
              <View>
                <ButtonLink
                  analyticsCategory="plan_expired"
                  analyticsLabel="select_a_plan_button"
                  children={
                    activePaidPlans.some(p => p.interval)
                      ? plan && plan.amount
                        ? 'Switch plan ↗'
                        : 'Select a plan ↗'
                      : 'See available options ↗'
                  }
                  href={`${constants.DEVHUB_LINKS.PRICING_PAGE}?appToken=${appToken}`}
                  openOnNewTab
                />
              </View>
            }
            errorMessage="You need a paid plan to keep using DevHub."
            errorTitle="Free trial expired"
            fetchNextPage={undefined}
            footer={
              <View style={sharedStyles.padding}>
                <QuickFeedbackRow />
              </View>
            }
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

    if (isOverPlanColumnLimit && plan && plan.featureFlags.columnsLimit) {
      return {
        Component: () => (
          <EmptyCards
            columnId={column.id}
            emoji="rocket"
            errorButtonView={
              <ButtonLink
                analyticsLabel="unlock_more_columns_button"
                children="Unlock more columns ↗"
                href={`${constants.DEVHUB_LINKS.PRICING_PAGE}?appToken=${appToken}`}
                openOnNewTab
              />
            }
            errorMessage={`You have exceeded the limit of ${
              plan.featureFlags.columnsLimit
            }${plan.amount ? '' : ' free'} ${
              plan.featureFlags.columnsLimit === 1 ? 'column' : 'columns'
            }.`}
            errorTitle="Limit exceeded"
            fetchNextPage={undefined}
            loadState="error"
            refresh={undefined}
          />
        ),
        overlay: true,
      }
    }

    if (!isPlanStatusValid(plan)) {
      return {
        Component: () => (
          <EmptyCards
            columnId={column.id}
            emoji="warning"
            errorButtonView={
              <ButtonLink
                analyticsLabel="select_a_plan_button"
                analyticsCategory="invalid_plan"
                children="Fix my subscription ↗"
                href={`${constants.DEVHUB_LINKS.ACCOUNT_PAGE}?appToken=${appToken}`}
                openOnNewTab
              />
            }
            errorMessage={`Your current subscription status is ${
              plan && plan.status ? `"${plan.status}"` : 'invalid'
            }. This is usually fixed by updating your credit card.`}
            errorTitle="Action needed"
            fetchNextPage={undefined}
            loadState="error"
            refresh={undefined}
          />
        ),
        overlay: true,
      }
    }

    if (isOverPlanColumnLimit) {
      return {
        Component: () => (
          <EmptyCards
            columnId={column.id}
            emoji="lock"
            errorButtonView={
              <ButtonLink
                analyticsLabel="select_a_plan_button"
                analyticsCategory="invalid_plan"
                children={
                  activePaidPlans.some(p => p.interval)
                    ? plan && plan.amount
                      ? 'Switch plan ↗'
                      : 'Select a plan ↗'
                    : 'See available options ↗'
                }
                href={`${constants.DEVHUB_LINKS.PRICING_PAGE}?appToken=${appToken}`}
                openOnNewTab
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
    appToken,
    !!(plan && plan.amount),
    !!(plan && plan.featureFlags.columnsLimit),
    isPlanStatusValid(plan),
  ])

  return useMemo(
    () => ({
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
    }),
    [
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
    ],
  )
}
