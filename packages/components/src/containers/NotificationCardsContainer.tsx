import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

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

    const hasPrivateAccess = useReduxState(
      selectors.githubHasPrivateAccessSelector,
    )
    const subscription = useReduxState(
      state =>
        selectors.subscriptionSelector(state, column.subscriptionIds[0]) as
          | NotificationColumnSubscription
          | undefined,
    )

    const data = (subscription && subscription.data) || {}

    const fetchColumnSubscriptionRequest = useReduxAction(
      actions.fetchColumnSubscriptionRequest,
    )

    const [filteredItems, setFilteredItems] = useState<
      EnhancedGitHubNotification[]
    >(() =>
      getFilteredNotifications(
        data.items || [],
        column.filters,
        hasPrivateAccess,
      ),
    )

    const canFetchMoreRef = useRef(false)

    useEffect(
      () => {
        setFilteredItems(
          getFilteredNotifications(
            data.items || [],
            column.filters,
            hasPrivateAccess,
          ),
        )
      },
      [data, column.filters],
    )

    useEffect(
      () => {
        canFetchMoreRef.current = (() => {
          const clearedAt = column.filters && column.filters.clearedAt
          const olderDate = getOlderNotificationDate(data.items || [])

          if (clearedAt && olderDate && clearedAt >= olderDate) return false
          return !!data.canFetchMore
        })()
      },
      [filteredItems, column.filters, data.canFetchMore],
    )

    if (!subscription) return null

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
      const perPage = _perPage || constants.DEFAULT_PAGINATION_PER_PAGE
      const currentPage = Math.ceil(
        (subscription.data.items || []).length / perPage,
      )
      const nextPage = (currentPage || 1) + 1
      fetchData({ page: nextPage, perPage })
    }

    return (
      <NotificationCards
        {...props}
        key={`notification-cards-${column.id}`}
        errorMessage={subscription.data.errorMessage || ''}
        fetchNextPage={canFetchMoreRef.current ? fetchNextPage : undefined}
        loadState={subscription.data.loadState || 'not_loaded'}
        notifications={filteredItems}
        refresh={() => fetchData()}
      />
    )
  },
)
