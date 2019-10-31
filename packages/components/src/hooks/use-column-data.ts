import { EnhancedItem, getFilteredItems, getItemNodeIdOrId } from '@devhub/core'
import _ from 'lodash'
import { useCallback, useMemo, useRef } from 'react'

import * as selectors from '../redux/selectors'
import { EMPTY_ARRAY } from '../utils/constants'
import { useColumn } from './use-column'
import { usePreviousRef } from './use-previous-ref'
import { useReduxState } from './use-redux-state'

export function useColumnData<ItemT extends EnhancedItem>(
  columnId: string,
  {
    mergeSimilar,
  }: {
    mergeSimilar?: boolean
  } = {},
) {
  const columnDataSelector = useMemo(selectors.createColumnDataSelector, [
    columnId,
  ])

  const { column, dashboardFromUsername, hasCrossedColumnsLimit } = useColumn(
    columnId,
  )

  const dataByNodeIdOrId = useReduxState(selectors.dataByNodeIdOrId)
  const plan = useReduxState(selectors.currentUserPlanSelector)

  const allItems = useReduxState(state => {
    if (!(column && column.id)) return EMPTY_ARRAY
    return columnDataSelector(state, column.id)
  }) as ItemT[]

  const _allItemsIds = useMemo(
    () => allItems.map(getItemNodeIdOrId).filter(Boolean) as string[],
    [allItems],
  )
  const allItemsIds = useMemo(() => _allItemsIds, [_allItemsIds.join(',')])

  const filteredItems = useMemo(() => {
    if (!(column && allItems && allItems.length)) return allItems || EMPTY_ARRAY

    const items = getFilteredItems(column.type, allItems, column.filters, {
      dashboardFromUsername,
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
    dashboardFromUsername,
  ]) as ItemT[]

  const _filteredItemsIds = useMemo(
    () => filteredItems.map(getItemNodeIdOrId).filter(Boolean) as string[],
    [filteredItems],
  )
  const filteredItemsIds = useMemo(() => _filteredItemsIds, [
    _filteredItemsIds.join(','),
  ])

  const previousDataByNodeIdOrIdRef = usePreviousRef(dataByNodeIdOrId)
  const getItemByNodeIdOrIdChangeCountRef = useRef(0)
  useMemo(() => {
    const changed = filteredItemsIds.some(
      id =>
        !previousDataByNodeIdOrIdRef.current ||
        previousDataByNodeIdOrIdRef.current[id] !== dataByNodeIdOrId[id],
    )
    if (changed)
      getItemByNodeIdOrIdChangeCountRef.current =
        getItemByNodeIdOrIdChangeCountRef.current + 1
  }, [dataByNodeIdOrId, filteredItemsIds])

  const getItemByNodeIdOrId = useCallback(
    (nodeIdOrId: string) => {
      return (dataByNodeIdOrId[nodeIdOrId] &&
        dataByNodeIdOrId[nodeIdOrId]!.item) as ItemT | undefined
    },
    [getItemByNodeIdOrIdChangeCountRef.current],
  )

  return {
    allItems,
    allItemsIds,
    filteredItems,
    filteredItemsIds,
    getItemByNodeIdOrId,
    hasCrossedColumnsLimit,
  }
}
