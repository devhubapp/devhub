import React, { useEffect, useRef, useState } from 'react'

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
      <EventCards
        {...props}
        key={`event-cards-${column.id}`}
        errorMessage={subscription.data.errorMessage || ''}
        fetchNextPage={canFetchMoreRef.current ? fetchNextPage : undefined}
        loadState={subscription.data.loadState || 'not_loaded'}
        events={filteredItems}
        refresh={() => fetchData()}
      />
    )
  },
)
