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
import { useColumnData } from '../hooks/use-column-data'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'

export type NotificationCardsContainerProps = Omit<
  NotificationCardsProps,
  | 'errorMessage'
  | 'fetchNextPage'
  | 'items'
  | 'lastFetchedAt'
  | 'loadState'
  | 'refresh'
>

export const NotificationCardsContainer = React.memo(
  (props: NotificationCardsContainerProps) => {
    const { cardViewMode, column, repoIsKnown, ...otherProps } = props

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

    const { allItems, filteredItems } = useColumnData<
      EnhancedGitHubNotification
    >(column.id, { mergeSimilar: cardViewMode !== 'compact' })

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
            perPage: getDefaultPaginationPerPage(column.type),
          },
          replaceAllItems: false,
        })
      },
      [fetchColumnSubscriptionRequest, column.id],
    )

    const fetchNextPage = useCallback(() => {
      const size = allItems.length

      const perPage = getDefaultPaginationPerPage(column.type)
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
        cardViewMode={cardViewMode}
        errorMessage={mainSubscription.data.errorMessage || ''}
        fetchNextPage={canFetchMore ? fetchNextPage : undefined}
        items={filteredItems}
        lastFetchedAt={mainSubscription.data.lastFetchedAt}
        loadState={
          installationsLoadState === 'loading' && !filteredItems.length
            ? 'loading_first'
            : mainSubscription.data.loadState || 'not_loaded'
        }
        refresh={refresh}
        repoIsKnown={repoIsKnown}
      />
    )
  },
)
