import _ from 'lodash'
import { useCallback, useEffect, useRef } from 'react'

import { EnhancedItem } from '@devhub/core'
import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useColumnData<ItemT extends EnhancedItem>(
  columnId: string,
  mergeSimilar: boolean,
) {
  const subscriptionsDataSelectorRef = useRef(
    selectors.createSubscriptionsDataSelector(),
  )

  const filteredSubscriptionsDataSelectorRef = useRef(
    selectors.createFilteredSubscriptionsDataSelector(mergeSimilar),
  )

  const column = useReduxState(
    useCallback(state => selectors.columnSelector(state, columnId), [columnId]),
  )

  useEffect(() => {
    subscriptionsDataSelectorRef.current = selectors.createSubscriptionsDataSelector()
    filteredSubscriptionsDataSelectorRef.current = selectors.createFilteredSubscriptionsDataSelector(
      mergeSimilar,
    )
  }, [column && column.subscriptionIds && column.subscriptionIds.join(',')])

  const allItems = useReduxState(
    useCallback(
      state => {
        if (!column) return []

        return subscriptionsDataSelectorRef.current(
          state,
          column.subscriptionIds,
        )
      },
      [
        column && column.subscriptionIds && column.subscriptionIds.join(','),
        column && column.filters,
      ],
    ),
  ) as ItemT[]

  const filteredItems = useReduxState(
    useCallback(
      state => {
        if (!column) return []

        return filteredSubscriptionsDataSelectorRef.current(
          state,
          column.subscriptionIds,
          column.filters,
        )
      },
      [column && column.subscriptionIds, column && column.filters],
    ),
  ) as ItemT[]

  return {
    allItems,
    column,
    filteredItems,
  }
}
