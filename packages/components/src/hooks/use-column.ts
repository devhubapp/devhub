import { constants, isPlanExpired } from '@devhub/core'
import _ from 'lodash'
import { useCallback, useMemo } from 'react'

import { usePlans } from '../components/context/PlansContext'
import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useColumn(columnId: string) {
  const { freeTrialDays } = usePlans()

  const column = useReduxState(
    useCallback((state) => selectors.columnSelector(state, columnId), [
      columnId,
    ]),
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
    useCallback((state) => columnHeaderDetailsSelector(state, columnId), [
      columnHeaderDetailsSelector,
      columnId,
    ]),
  )

  const isOverPlanColumnLimit = !!(
    plan &&
    columnIndex + 1 > plan.featureFlags.columnsLimit &&
    (plan.featureFlags.columnsLimit || freeTrialDays || isPlanExpired(plan))
  )
  const isOverMaxColumnLimit = !!(
    columnIndex >= 0 && columnIndex + 1 > constants.COLUMNS_LIMIT
  )

  const hasCrossedColumnsLimit = isOverPlanColumnLimit || isOverMaxColumnLimit

  const dashboardFromUsername =
    (headerDetails &&
      (headerDetails.mainSubscriptionSubtype === 'USER_RECEIVED_EVENTS' ||
        headerDetails.mainSubscriptionSubtype ===
          'USER_RECEIVED_PUBLIC_EVENTS') &&
      headerDetails.owner) ||
    undefined

  return useMemo(
    () => ({
      column,
      columnIndex,
      dashboardFromUsername,
      hasCrossedColumnsLimit,
      headerDetails,
      isOverMaxColumnLimit,
      isOverPlanColumnLimit,
      plan,
    }),
    [
      column,
      columnIndex,
      dashboardFromUsername,
      hasCrossedColumnsLimit,
      headerDetails,
      isOverMaxColumnLimit,
      isOverPlanColumnLimit,
      plan,
    ],
  )
}
