import _ from 'lodash'
import { useCallback } from 'react'

import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useColumn(columnId: string) {
  const column = useReduxState(
    useCallback(state => selectors.columnSelector(state, columnId), [columnId]),
  )

  const columnIndex = useReduxState(selectors.columnIdsSelector).indexOf(
    columnId,
  )

  const headerDetails = useReduxState(
    useCallback(
      state => selectors.columnHeaderDetailsSelector(state, columnId),
      [columnId],
    ),
  )

  return {
    column,
    columnIndex,
    headerDetails,
  }
}
