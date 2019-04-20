import React, { useCallback, useEffect, useRef } from 'react'

import {
  constants,
  EnhancedGitHubNotification,
  getOlderNotificationDate,
  NotificationColumnSubscription,
  Omit,
} from '@devhub/core'
import {
  NotificationCards,
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import { NoTokenView } from '../components/cards/NoTokenView'
import { useAppViewMode } from '../hooks/use-app-view-mode'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'

export type NotificationCardsContainerProps = Omit<
  NotificationCardsProps,
  | 'cardViewMode'
  | 'errorMessage'
  | 'fetchNextPage'
  | 'lastFetchedAt'
  | 'loadState'
  | 'notifications'
  | 'refresh'
>

export const NotificationCardsContainer = React.memo(
  (props: NotificationCardsContainerProps) => {
    const { column, ...otherProps } = props

    const { cardViewMode } = useAppViewMode()

    const appToken = useReduxState(selectors.appTokenSelector)
    const githubOAuthToken = useReduxState(selectors.githubOAuthTokenSelector)
    const githubOAuthScope = useReduxState(selectors.githubOAuthScopeSelector)

    // TODO: Support multiple subscriptions per column.
    const mainSubscription = useReduxState(
      useCallback(
        state => selectors.columnSubscriptionSelector(state, column.id),
        [column.id],
      ),
    ) as NotificationColumnSubscription | undefined

    const data = (mainSubscription && mainSubscription.data) || {}

    const installationsLoadState = useReduxState(
      selectors.installationsLoadStateSelector,
    )

    const fetchColumnSubscriptionRequest = useReduxAction(
      actions.fetchColumnSubscriptionRequest,
    )

    const subscriptionsDataSelectorRef = useRef(
      selectors.createSubscriptionsDataSelector(),
    )

    const filteredSubscriptionsDataSelectorRef = useRef(
      selectors.createFilteredSubscriptionsDataSelector(cardViewMode),
    )

    useEffect(() => {
      subscriptionsDataSelectorRef.current = selectors.createSubscriptionsDataSelector()
      filteredSubscriptionsDataSelectorRef.current = selectors.createFilteredSubscriptionsDataSelector(
        cardViewMode,
      )
    }, [cardViewMode, ...column.subscriptionIds])

    const allItems = useReduxState(
      useCallback(
        state => {
          return subscriptionsDataSelectorRef.current(
            state,
            column.subscriptionIds,
          )
        },
        [column.subscriptionIds, column.filters],
      ),
    ) as EnhancedGitHubNotification[]

    const filteredItems = useReduxState(
      useCallback(
        state => {
          return filteredSubscriptionsDataSelectorRef.current(
            state,
            column.subscriptionIds,
            column.filters,
          )
        },
        [column.subscriptionIds, column.filters],
      ),
    ) as EnhancedGitHubNotification[]

    const clearedAt = column.filters && column.filters.clearedAt
    const olderDate = getOlderNotificationDate(allItems)

    const canFetchMore =
      clearedAt && (!olderDate || (olderDate && clearedAt >= olderDate))
        ? false
        : !!data.canFetchMore

    const fetchData = useCallback(
      ({ page }: { page?: number } = {}) => {
        fetchColumnSubscriptionRequest({
          columnId: column.id,
          params: {
            page: page || 1,
            perPage: constants.DEFAULT_PAGINATION_PER_PAGE,
          },
        })
      },
      [fetchColumnSubscriptionRequest, column.id],
    )

    const fetchNextPage = useCallback(() => {
      const size = allItems.length

      const perPage = constants.DEFAULT_PAGINATION_PER_PAGE
      const currentPage = Math.ceil(size / perPage)

      const nextPage = (currentPage || 0) + 1
      fetchData({ page: nextPage })
    }, [fetchData, allItems.length])

    const refresh = useCallback(() => {
      fetchData()
    }, [fetchData])

    if (!mainSubscription) return null

    if (
      !(
        appToken &&
        githubOAuthToken &&
        githubOAuthScope &&
        githubOAuthScope.includes('notifications')
      )
    ) {
      return <NoTokenView githubAppType="oauth" />
    }

    return (
      <NotificationCards
        {...otherProps}
        key={`notification-cards-${column.id}`}
        column={column}
        errorMessage={mainSubscription.data.errorMessage || ''}
        fetchNextPage={canFetchMore ? fetchNextPage : undefined}
        lastFetchedAt={mainSubscription.data.lastFetchedAt}
        loadState={
          installationsLoadState === 'loading' && !filteredItems.length
            ? 'loading_first'
            : mainSubscription.data.loadState || 'not_loaded'
        }
        notifications={filteredItems}
        refresh={refresh}
      />
    )
  },
)
