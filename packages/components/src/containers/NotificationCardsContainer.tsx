import {
  EnhancedGitHubNotification,
  getDefaultPaginationPerPage,
  getOlderOrNewerItemDate,
  NotificationColumnSubscription,
} from '@devhub/core'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import {
  NotificationCards,
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import { NoTokenView } from '../components/cards/NoTokenView'
import { useColumn } from '../hooks/use-column'
import { useColumnData } from '../hooks/use-column-data'
import { useReduxState } from '../hooks/use-redux-state'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'

export interface NotificationCardsContainerProps
  extends Omit<
    NotificationCardsProps,
    | 'column'
    | 'errorMessage'
    | 'fetchNextPage'
    | 'getItemByNodeIdOrId'
    | 'isShowingOnlyBookmarks'
    | 'itemNodeIdOrIds'
    | 'lastFetchSuccessAt'
    | 'refresh'
  > {
  columnId: string
}

export const NotificationCardsContainer = React.memo(
  (props: NotificationCardsContainerProps) => {
    const { columnId, ...otherProps } = props

    const { column } = useColumn(columnId)

    const dispatch = useDispatch()

    const appToken = useReduxState(selectors.appTokenSelector)
    const githubToken = useReduxState(selectors.githubTokenSelector)
    const githubOAuthScope = useReduxState(selectors.githubOAuthScopeSelector)

    // TODO: Support multiple subscriptions per column.
    const mainSubscription = useReduxState(
      useCallback(
        (state) =>
          selectors.createColumnSubscriptionSelector()(state, columnId),
        [columnId],
      ),
    )

    const data = mainSubscription && mainSubscription.data

    const { allItems, filteredItemsIds, getItemByNodeIdOrId } = useColumnData<
      EnhancedGitHubNotification
    >(columnId, { mergeSimilar: false })

    const clearedAt = column && column.filters && column.filters.clearedAt
    const olderDate = getOlderOrNewerItemDate(
      'notifications',
      'older',
      allItems,
    )

    const canFetchMore =
      clearedAt && (!olderDate || (olderDate && clearedAt >= olderDate))
        ? false
        : !!(data && data.canFetchMore)

    const fetchData = useCallback(
      ({ page }: { page?: number } = {}) => {
        dispatch(
          actions.fetchColumnSubscriptionRequest({
            columnId,
            params: {
              page: page || 1,
              perPage: getDefaultPaginationPerPage('notifications'),
            },
            replaceAllItems: false,
          }),
        )
      },
      [columnId],
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
        githubToken &&
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
        columnId={columnId}
        errorMessage={mainSubscription.data.errorMessage || ''}
        fetchNextPage={canFetchMore ? fetchNextPage : undefined}
        getItemByNodeIdOrId={getItemByNodeIdOrId}
        isShowingOnlyBookmarks={!!(column.filters && column.filters.saved)}
        itemNodeIdOrIds={filteredItemsIds}
        lastFetchSuccessAt={mainSubscription.data.lastFetchSuccessAt}
        refresh={refresh}
      />
    )
  },
)

NotificationCardsContainer.displayName = 'NotificationCardsContainer'
