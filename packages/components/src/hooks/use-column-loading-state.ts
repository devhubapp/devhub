import _ from 'lodash'
import { useCallback } from 'react'

import { EnhancedLoadState } from '@devhub/core'
import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useColumnLoadingState(columnId: string): EnhancedLoadState {
  const mainSubscription = useReduxState(
    useCallback(
      state => selectors.columnSubscriptionSelector(state, columnId),
      [columnId],
    ),
  )

  const installationsLoadState = useReduxState(
    selectors.installationsLoadStateSelector,
  )

  const loadState: EnhancedLoadState =
    installationsLoadState === 'loading'
      ? mainSubscription &&
        mainSubscription.data &&
        mainSubscription.data.items &&
        mainSubscription.data.items.length
        ? 'loading'
        : 'loading_first'
      : (mainSubscription &&
          mainSubscription.data &&
          mainSubscription.data.loadState) ||
        'not_loaded'

  return loadState
}
