import _ from 'lodash'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { EnhancedItem, getFilteredItems } from '@devhub/core'
import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useColumnData<ItemT extends EnhancedItem>(
  columnId: string,
  mergeSimilar: boolean,
) {
  const subscriptionsDataSelectorRef = useRef(
    selectors.createSubscriptionsDataSelector(),
  )

  const column = useReduxState(
    useCallback(state => selectors.columnSelector(state, columnId), [columnId]),
  )

  useEffect(() => {
    subscriptionsDataSelectorRef.current = selectors.createSubscriptionsDataSelector()
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

  const filteredItems = useMemo(() => {
    if (!column) return allItems
    return getFilteredItems(column.type, allItems, column.filters, mergeSimilar)
  }, [
    column && column.type,
    allItems,
    column && column.filters,
    mergeSimilar,
  ]) as ItemT[]

  return {
    allItems,
    filteredItems,
  }
}
