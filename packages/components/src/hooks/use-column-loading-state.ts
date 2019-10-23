import _ from 'lodash'
import { useCallback } from 'react'

import { EnhancedLoadState } from '@devhub/core'
import * as selectors from '../redux/selectors'
import { useColumn } from './use-column'
import { useReduxState } from './use-redux-state'

export function useColumnLoadingState(columnId: string): EnhancedLoadState {
  const { hasCrossedColumnsLimit } = useColumn(columnId)

  const mainSubscription = useReduxState(
    useCallback(
      state => selectors.columnSubscriptionSelector(state, columnId),
      [columnId],
    ),
  )

  const installationsLoadState = useReduxState(
    selectors.installationsLoadStateSelector,
  )

  const loadState: EnhancedLoadState = hasCrossedColumnsLimit
    ? 'not_loaded'
    : installationsLoadState === 'loading'
    ? mainSubscription &&
      mainSubscription.data &&
      mainSubscription.data.itemNodeIdOrIds &&
      mainSubscription.data.itemNodeIdOrIds.length
      ? 'loading'
      : 'loading_first'
    : (mainSubscription &&
        mainSubscription.data &&
        mainSubscription.data.loadState) ||
      'not_loaded'

  return loadState
}
