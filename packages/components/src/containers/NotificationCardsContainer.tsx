import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

import {
  Column,
  ColumnSubscription,
  DEFAULT_PAGINATION_PER_PAGE,
  EnhancedGitHubNotification,
  getOlderNotificationDate,
  NotificationSubscription,
  Omit,
} from '@devhub/core'
import {
  NotificationCards,
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import * as actions from '../redux/actions'
import { useReduxAction } from '../redux/hooks/use-redux-action'
import { useReduxState } from '../redux/hooks/use-redux-state'
import * as selectors from '../redux/selectors'
import { getFilteredNotifications } from '../utils/helpers/filters'

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

    const subscription = useReduxState(
      state =>
        selectors.subscriptionSelector(
          state,
          column.subscriptionIds[0],
        ) as NotificationSubscription,
    )

    const fetchColumnSubscriptionRequest = useReduxAction(
      actions.fetchColumnSubscriptionRequest,
    )

    const [filteredItems, setFilteredItems] = useState<
      EnhancedGitHubNotification[]
    >(() => getFilteredNotifications(subscription.data || [], column.filters))

    const canFetchMoreRef = useRef(false)

    useEffect(
      () => {
        setFilteredItems(
          getFilteredNotifications(subscription.data || [], column.filters),
        )
      },
      [subscription.data, column.filters],
    )

    useEffect(
      () => {
        canFetchMoreRef.current = (() => {
          const clearedAt = column.filters && column.filters.clearedAt
          const olderDate = getOlderNotificationDate(subscription.data || [])

          if (clearedAt && olderDate && clearedAt >= olderDate) return false
          return !!subscription.canFetchMore
        })()
      },
      [filteredItems, column.filters, subscription.canFetchMore],
    )

    const fetchData = ({
      page,
      perPage,
    }: { page?: number; perPage?: number } = {}) => {
      fetchColumnSubscriptionRequest({
        columnId: column.id,
        params: {
          page: page || 1,
          perPage,
        },
      })
    }

    const fetchNextPage = ({
      perPage: _perPage,
    }: { perPage?: number } = {}) => {
      const perPage = _perPage || DEFAULT_PAGINATION_PER_PAGE
      const currentPage = Math.ceil((subscription.data || []).length / perPage)
      const nextPage = (currentPage || 1) + 1
      fetchData({ page: nextPage, perPage })
    }

    return (
      <NotificationCards
        {...props}
        key={`notification-cards-${column.id}`}
        errorMessage={subscription.errorMessage || ''}
        fetchNextPage={canFetchMoreRef.current ? fetchNextPage : undefined}
        loadState={subscription.loadState || 'not_loaded'}
        notifications={filteredItems}
        refresh={() => fetchData()}
      />
    )
  },
)
