import React, { useCallback, useEffect, useRef, useState } from 'react'

import {
  ActivityColumnSubscription,
  Column,
  ColumnSubscription,
  constants,
  EnhancedGitHubEvent,
  getOlderEventDate,
  Omit,
} from '@devhub/core'
import { EventCards, EventCardsProps } from '../components/cards/EventCards'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { getFilteredEvents } from '../utils/helpers/filters'

export type EventCardsContainerProps = Omit<
  EventCardsProps,
  'errorMessage' | 'events' | 'fetchNextPage' | 'loadState' | 'refresh'
> & {
  column: Column
  subscriptions: ColumnSubscription[]
}

export const EventCardsContainer = React.memo(
  (props: EventCardsContainerProps) => {
    const { column } = props

    const hasPrivateAccess = useReduxState(
      selectors.githubHasPrivateAccessSelector,
    )
    const subscription = useReduxState(
      state =>
        selectors.subscriptionSelector(state, column.subscriptionIds[0]) as
          | ActivityColumnSubscription
          | undefined,
    )

    const data = (subscription && subscription.data) || {}

    const fetchColumnSubscriptionRequest = useReduxAction(
      actions.fetchColumnSubscriptionRequest,
    )

    const [filteredItems, setFilteredItems] = useState<EnhancedGitHubEvent[]>(
      () =>
        getFilteredEvents(data.items || [], column.filters, hasPrivateAccess),
    )

    const canFetchMoreRef = useRef(false)

    useEffect(
      () => {
        setFilteredItems(
          getFilteredEvents(data.items || [], column.filters, hasPrivateAccess),
        )
      },
      [data, column.filters],
    )

    useEffect(
      () => {
        canFetchMoreRef.current = (() => {
          const clearedAt = column.filters && column.filters.clearedAt
          const olderDate = getOlderEventDate(data.items || [])

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
        const size = subscription ? (subscription.data.items || []).length : 0

        const perPage = constants.DEFAULT_PAGINATION_PER_PAGE
        const currentPage = Math.ceil(size / perPage)

        const nextPage = (currentPage || 0) + 1
        fetchData({ page: nextPage })
      },
      [fetchData, subscription && (subscription.data.items || []).length],
    )

    const refresh = useCallback(
      () => {
        fetchData()
      },
      [fetchData],
    )

    if (!subscription) return null

    return (
      <EventCards
        {...props}
        key={`event-cards-${column.id}`}
        errorMessage={subscription.data.errorMessage || ''}
        fetchNextPage={canFetchMoreRef.current ? fetchNextPage : undefined}
        loadState={subscription.data.loadState || 'not_loaded'}
        events={filteredItems}
        refresh={refresh}
      />
    )
  },
)
