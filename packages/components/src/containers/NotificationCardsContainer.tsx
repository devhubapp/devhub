import { EnhancedGitHubNotification } from '@devhub/core'
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
    | 'itemNodeIdOrIds'
    | 'lastFetchedSuccessfullyAt'
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
    const githubOAuthToken = useReduxState(selectors.githubOAuthTokenSelector)
    const githubOAuthScope = useReduxState(selectors.githubOAuthScopeSelector)
    const notificationsState = useReduxState(selectors.notificationsState)

    const { filteredItemsIds, getItemByNodeIdOrId } = useColumnData<
      EnhancedGitHubNotification
    >(columnId, { mergeSimilar: false })

    const refresh = useCallback(() => {
      dispatch(actions.fetchNotificationsRequest())
    }, [])

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
        columnId={columnId}
        errorMessage={notificationsState.errorMessage || ''}
        fetchNextPage={undefined}
        getItemByNodeIdOrId={getItemByNodeIdOrId}
        itemNodeIdOrIds={filteredItemsIds}
        lastFetchedSuccessfullyAt={
          notificationsState.lastFetchedSuccessAt || undefined
        }
        refresh={refresh}
      />
    )
  },
)

NotificationCardsContainer.displayName = 'NotificationCardsContainer'
