import React, { useCallback, useEffect, useRef } from 'react'

import {
  Column,
  ColumnSubscription,
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
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'

export type NotificationCardsContainerProps = Omit<
  NotificationCardsProps,
  'errorMessage' | 'notifications' | 'fetchNextPage' | 'loadState' | 'refresh'
> & {
  column: Column
  subscriptions: ColumnSubscription[]
}

export const NotificationCardsContainer = React.memo(
  (props: NotificationCardsContainerProps) => {
    const { column } = props

    const firstSubscription = useReduxState(
      state =>
        selectors.subscriptionSelector(state, column.subscriptionIds[0]) as
          | NotificationColumnSubscription
          | undefined,
    )

    const data = (firstSubscription && firstSubscription.data) || {}

    const fetchColumnSubscriptionRequest = useReduxAction(
      actions.fetchColumnSubscriptionRequest,
    )

    const subscriptionsDataSelectorRef = useRef(
      selectors.createSubscriptionsDataSelector(),
    )

    const filteredSubscriptionsDataSelectorRef = useRef(
      selectors.createFilteredSubscriptionsDataSelector(),
    )

    useEffect(() => {
      subscriptionsDataSelectorRef.current = selectors.createSubscriptionsDataSelector()
      filteredSubscriptionsDataSelectorRef.current = selectors.createFilteredSubscriptionsDataSelector()
    }, column.subscriptionIds)

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

    const canFetchMoreRef = useRef(false)

    useEffect(
      () => {
        canFetchMoreRef.current = (() => {
          const clearedAt = column.filters && column.filters.clearedAt
          const olderDate = getOlderNotificationDate(allItems)

          if (
            clearedAt &&
            (!olderDate || (olderDate && clearedAt >= olderDate))
          )
            return false
          return !!data.canFetchMore
        })()
      },
      [filteredItems, column.filters, data.canFetchMore],
    )

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

    const fetchNextPage = useCallback(
      () => {
        const size = allItems.length

        const perPage = constants.DEFAULT_PAGINATION_PER_PAGE
        const currentPage = Math.ceil(size / perPage)

        const nextPage = (currentPage || 0) + 1
        fetchData({ page: nextPage })
      },
      [fetchData, allItems.length],
    )

    const refresh = useCallback(
      () => {
        fetchData()
      },
      [fetchData],
    )

    if (!firstSubscription) return null

    return (
      <NotificationCards
        {...props}
        key={`notification-cards-${column.id}`}
        errorMessage={firstSubscription.data.errorMessage || ''}
        fetchNextPage={canFetchMoreRef.current ? fetchNextPage : undefined}
        loadState={firstSubscription.data.loadState || 'not_loaded'}
        notifications={filteredItems}
        refresh={refresh}
      />
    )
  },
)
