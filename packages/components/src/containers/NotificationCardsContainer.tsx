import React, { useCallback } from 'react'

import {
  EnhancedGitHubNotification,
  getDefaultPaginationPerPage,
  getOlderNotificationDate,
  NotificationColumnSubscription,
} from '@devhub/core'
import {
  NotificationCards,
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import { NoTokenView } from '../components/cards/NoTokenView'
import { useColumn } from '../hooks/use-column'
import { useColumnData } from '../hooks/use-column-data'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'

export interface NotificationCardsContainerProps
  extends Omit<
    NotificationCardsProps,
    | 'column'
    | 'errorMessage'
    | 'fetchNextPage'
    | 'items'
    | 'lastFetchedAt'
    | 'refresh'
  > {
  columnId: string
}

export const NotificationCardsContainer = React.memo(
  (props: NotificationCardsContainerProps) => {
    const { columnId, ...otherProps } = props

    const { column } = useColumn(columnId)

    const appToken = useReduxState(selectors.appTokenSelector)
    const githubOAuthToken = useReduxState(selectors.githubOAuthTokenSelector)
    const githubOAuthScope = useReduxState(selectors.githubOAuthScopeSelector)

    // TODO: Support multiple subscriptions per column.
    const mainSubscription = useReduxState(
      useCallback(
        state => selectors.columnSubscriptionSelector(state, columnId),
        [columnId],
      ),
    ) as NotificationColumnSubscription | undefined

    const data = (mainSubscription && mainSubscription.data) || {}

    const fetchColumnSubscriptionRequest = useReduxAction(
      actions.fetchColumnSubscriptionRequest,
    )

    const { allItems, filteredItems } = useColumnData<
      EnhancedGitHubNotification
    >(columnId, { mergeSimilar: false })

    const clearedAt = column && column.filters && column.filters.clearedAt
    const olderDate = getOlderNotificationDate(allItems)

    const canFetchMore =
      clearedAt && (!olderDate || (olderDate && clearedAt >= olderDate))
        ? false
        : !!data.canFetchMore

    const fetchData = useCallback(
      ({ page }: { page?: number } = {}) => {
        fetchColumnSubscriptionRequest({
          columnId,
          params: {
            page: page || 1,
            perPage: getDefaultPaginationPerPage('notifications'),
          },
          replaceAllItems: false,
        })
      },
      [fetchColumnSubscriptionRequest, columnId],
    )

    const fetchNextPage = useCallback(() => {
      const size = allItems.length

      const perPage = getDefaultPaginationPerPage('notifications')
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

    if (!column) return null

    return (
      <NotificationCards
        {...otherProps}
        key={`notification-cards-${columnId}`}
        column={column}
        errorMessage={mainSubscription.data.errorMessage || ''}
        fetchNextPage={canFetchMore ? fetchNextPage : undefined}
        items={filteredItems}
        lastFetchedAt={mainSubscription.data.lastFetchedAt}
        refresh={refresh}
      />
    )
  },
)

NotificationCardsContainer.displayName = 'NotificationCardsContainer'
