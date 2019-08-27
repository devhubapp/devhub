import _ from 'lodash'
import { useCallback, useMemo } from 'react'

import { EnhancedItem, getFilteredItems } from '@devhub/core'
import * as selectors from '../redux/selectors'
import { EMPTY_ARRAY } from '../utils/constants'
import { useReduxState } from './use-redux-state'

export function useColumnData<ItemT extends EnhancedItem>(
  columnId: string,
  {
    mergeSimilar,
  }: {
    mergeSimilar?: boolean
  } = {},
) {
  const subscriptionsDataSelector = useMemo(
    selectors.createSubscriptionsDataSelector,
    [columnId],
  )

  const column = useReduxState(
    useCallback(state => selectors.columnSelector(state, columnId), [columnId]),
  )

  const allItems = useReduxState(
    useCallback(
      state => {
        if (
          !(column && column.subscriptionIds && column.subscriptionIds.length)
        )
          return EMPTY_ARRAY
        return subscriptionsDataSelector(state, column.subscriptionIds)
      },
      [column && column.subscriptionIds && column.subscriptionIds.join(',')],
    ),
  ) as ItemT[]

  const filteredItems = useMemo(() => {
    if (!column) return allItems
    return getFilteredItems(column.type, allItems, column.filters, {
      mergeSimilar: !!mergeSimilar,
    })
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
