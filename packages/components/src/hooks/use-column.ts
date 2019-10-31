import _ from 'lodash'
import { useCallback, useMemo } from 'react'

import { constants } from '@devhub/core'
import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useColumn(columnId: string) {
  const column = useReduxState(
    useCallback(state => selectors.columnSelector(state, columnId), [columnId]),
  )

  const columnIndex = useReduxState(selectors.columnIdsSelector).indexOf(
    columnId,
  )

  const plan = useReduxState(selectors.currentUserPlanSelector)

  const columnHeaderDetailsSelector = useMemo(
    () => selectors.createColumnHeaderDetailsSelector(),
    [columnId],
  )

  const headerDetails = useReduxState(
    useCallback(state => columnHeaderDetailsSelector(state, columnId), [
      columnHeaderDetailsSelector,
      columnId,
    ]),
  )

  const hasCrossedColumnsLimit =
    columnIndex + 1 > constants.COLUMNS_LIMIT ||
    !!(plan && columnIndex + 1 > plan.featureFlags.columnsLimit)

  const dashboardFromUsername =
    (headerDetails &&
      (headerDetails.mainSubscriptionSubtype === 'USER_RECEIVED_EVENTS' ||
        headerDetails.mainSubscriptionSubtype ===
          'USER_RECEIVED_PUBLIC_EVENTS') &&
      headerDetails.owner) ||
    undefined

  return {
    column,
    columnIndex,
    dashboardFromUsername,
    hasCrossedColumnsLimit,
    headerDetails,
  }
}
