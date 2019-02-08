import { useCallback, useEffect, useRef } from 'react'

import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useColumn(columnId: string) {
  const columnSelectorRef = useRef(selectors.createColumnSelector())

  useEffect(
    () => {
      columnSelectorRef.current = selectors.createColumnSelector()
    },
    [columnId],
  )

  const columnSubscriptionsSelector = useRef(
    selectors.createColumnSubscriptionsSelector(),
  ).current

  const column = useReduxState(
    useCallback(state => columnSelectorRef.current(state, columnId), [
      columnId,
    ]),
  )

  const columnIndex = useReduxState(
    useCallback(state => selectors.columnIdsSelector(state).indexOf(columnId), [
      columnId,
    ]),
  )

  const subscriptions = useReduxState(
    useCallback(state => columnSubscriptionsSelector(state, columnId), [
      columnId,
    ]),
  )

  return { column, columnIndex, subscriptions }
}
