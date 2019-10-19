import _ from 'lodash'
import { useCallback, useMemo } from 'react'

import { EnhancedItem, getFilteredItems } from '@devhub/core'
import * as selectors from '../redux/selectors'
import { EMPTY_ARRAY } from '../utils/constants'
import { useColumn } from './use-column'
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

  const { column, hasCrossedColumnsLimit } = useColumn(columnId)

  const loggedUsername = useReduxState(selectors.currentGitHubUsernameSelector)!
  const plan = useReduxState(selectors.currentUserPlanSelector)

  const allItems = useReduxState(
    useCallback(
      state => {
        if (
          !(column && column.subscriptionIds && column.subscriptionIds.length)
        )
          return EMPTY_ARRAY
        return subscriptionsDataSelector(state, column.subscriptionIds)
      },
      [
        hasCrossedColumnsLimit,
        column && column.subscriptionIds && column.subscriptionIds.join(','),
      ],
    ),
  ) as ItemT[]

  const allItemsIds = useMemo(
    () => allItems.map(item => item.id).filter(Boolean),
    [allItems],
  )

  const filteredItems = useMemo(() => {
    if (!(column && allItems && allItems.length)) return allItems || EMPTY_ARRAY

    const items = getFilteredItems(column.type, allItems, column.filters, {
      loggedUsername,
      mergeSimilar: !!mergeSimilar,
      plan,
    })
    if (hasCrossedColumnsLimit) return items.slice(0, 10)
    return items
  }, [
    allItems,
    column && column.filters,
    column && column.type,
    hasCrossedColumnsLimit,
    mergeSimilar,
    loggedUsername,
  ]) as ItemT[]

  const filteredItemsIds = useMemo(
    () => filteredItems.map(item => item.id).filter(Boolean),
    [filteredItems],
  )

  return {
    allItems,
    allItemsIds,
    filteredItems,
    filteredItemsIds,
    hasCrossedColumnsLimit,
  }
}
