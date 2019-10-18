import _ from 'lodash'
import { useCallback } from 'react'

import { EnhancedLoadState } from '@devhub/core'
import * as selectors from '../redux/selectors'
import { useColumn } from './use-column'
import { useReduxState } from './use-redux-state'

export function useColumnLoadingState(columnId: string): EnhancedLoadState {
  const { column, hasCrossedColumnsLimit } = useColumn(columnId)

  const mainSubscription = useReduxState(
    useCallback(
      state => selectors.columnSubscriptionSelector(state, columnId),
      [columnId],
    ),
  )

  const installationsLoadState = useReduxState(
    selectors.installationsLoadStateSelector,
  )

  const notificationsLoadState = useReduxState(
    state => selectors.notificationsState(state).loadingState,
  )

  const loadState: EnhancedLoadState = hasCrossedColumnsLimit
    ? 'not_loaded'
    : installationsLoadState === 'loading'
    ? (column && column.type === 'notifications') ||
      (mainSubscription &&
        mainSubscription.data &&
        mainSubscription.data.itemNodeIdOrIds &&
        mainSubscription.data.itemNodeIdOrIds.length)
      ? 'loading'
      : 'loading_first'
    : column && column.type === 'notifications'
    ? notificationsLoadState === 'loading-all'
      ? 'loading'
      : notificationsLoadState
    : (mainSubscription &&
        mainSubscription.data &&
        mainSubscription.data.loadState) ||
      'not_loaded'

  return loadState
}
