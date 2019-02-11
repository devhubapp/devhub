import React, { useCallback, useEffect, useRef } from 'react'

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
import { NoTokenView } from '../components/cards/NoTokenView'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'

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

    const appToken = useReduxState(selectors.appTokenSelector)
    const githubAppToken = useReduxState(selectors.githubAppTokenSelector)
    const githubOAuthToken = useReduxState(selectors.githubOAuthTokenSelector)

    const firstSubscription = useReduxState(
      state =>
        selectors.subscriptionSelector(state, column.subscriptionIds[0]) as
          | ActivityColumnSubscription
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
    ) as EnhancedGitHubEvent[]

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
    ) as EnhancedGitHubEvent[]

    const canFetchMoreRef = useRef(false)

    useEffect(
      () => {
        canFetchMoreRef.current = (() => {
          const clearedAt = column.filters && column.filters.clearedAt
          const olderDate = getOlderEventDate(allItems)

          if (
            clearedAt &&
            (!olderDate || (olderDate && clearedAt >= olderDate))
          )
            return false
          return !!data.canFetchMore
        })()
      },
      [allItems, column.filters, data.canFetchMore],
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

    if (!(appToken && githubOAuthToken)) {
      return <NoTokenView githubAppType={githubAppToken ? 'oauth' : 'both'} />
    }

    if (
      (firstSubscription.data.errorMessage || '')
        .toLowerCase()
        .includes('not found')
    ) {
      if (!githubAppToken) return <NoTokenView githubAppType="app" />

      // TODO: Show button to install GitHub App because it may be a private repo
    }

    return (
      <EventCards
        {...props}
        key={`event-cards-${column.id}`}
        errorMessage={firstSubscription.data.errorMessage || ''}
        fetchNextPage={canFetchMoreRef.current ? fetchNextPage : undefined}
        loadState={firstSubscription.data.loadState || 'not_loaded'}
        events={filteredItems}
        refresh={refresh}
      />
    )
  },
)
