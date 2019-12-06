import {
  ColumnSubscription,
  constants,
  getItemsFromSubscriptions,
} from '@devhub/core'
import _ from 'lodash'
import { createSelector } from 'reselect'

import { EMPTY_ARRAY, EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'
import { currentUserPlanSelector } from './auth'
import { columnsArrSelector } from './columns'
import { createImmerSelector } from './helpers'

const s = (state: RootState) => state.subscriptions || EMPTY_OBJ

export const subscriptionIdsSelector = (state: RootState) =>
  s(state).allIds || EMPTY_ARRAY

export const subscriptionSelector = (state: RootState, id: string) =>
  (s(state).byId && s(state).byId[id]) || undefined

export const allSubscriptionsArrSelector = createImmerSelector(
  (state: RootState) => {
    const subscriptionIds = subscriptionIdsSelector(state)
    const byId = s(state).byId

    if (!(byId && subscriptionIds && subscriptionIds.length)) return EMPTY_ARRAY

    return subscriptionIds
      .map(id => byId[id])
      .filter(Boolean) as ColumnSubscription[]
  },
)

export const userSubscriptionsArrSelector = createImmerSelector(
  (state: RootState): ColumnSubscription[] => {
    const plan = currentUserPlanSelector(state)
    const columns = columnsArrSelector(state)
    const byId = s(state).byId

    if (!(plan && columns && columns.length && byId)) return EMPTY_ARRAY

    const limit =
      (plan && plan.featureFlags.columnsLimit) || constants.COLUMNS_LIMIT
    const validColumns = columns
      .filter(c => c.subscriptionIds && c.subscriptionIds.length)
      .slice(0, limit)

    const ids = _.uniq(
      validColumns.reduce<string[]>((result, column) => {
        return result.concat(column.subscriptionIds)
      }, []),
    )

    return ids.map(id => byId[id]).filter(Boolean) as ColumnSubscription[]
  },
)

export const createSubscriptionsSelector = () =>
  createImmerSelector((state: RootState, subscriptionIds: string[]) => {
    return subscriptionIds
      .map(id => subscriptionSelector(state, id))
      .filter(Boolean) as ColumnSubscription[]
  })

export const createSubscriptionsDataSelector = () => {
  const subscriptionsSelector = createSubscriptionsSelector()
  const memoizedGetItemsFromSubscriptions = createImmerSelector(
    getItemsFromSubscriptions,
  )

  return createImmerSelector((state: RootState, subscriptionIds: string[]) => {
    const subscriptions = subscriptionsSelector(state, subscriptionIds)
    const dataByNodeIdOrId = state.data.byId

    const getItemByNodeIdOrId = (nodeIdOrId: string) =>
      dataByNodeIdOrId &&
      dataByNodeIdOrId[nodeIdOrId] &&
      dataByNodeIdOrId[nodeIdOrId]!.item

    const result = memoizedGetItemsFromSubscriptions(
      subscriptions,
      getItemByNodeIdOrId,
    )

    if (!(result && result.length)) return EMPTY_ARRAY

    return result
  })
}

export const subscriptionLastFetchedAtSelector = createSelector(
  (state: RootState, subscriptionId: string) =>
    subscriptionSelector(state, subscriptionId),
  subscription => {
    if (!(subscription && subscription.data)) return

    return _.max([
      subscription.data.lastFetchRequestAt,
      subscription.data.lastFetchFailureAt,
      subscription.data.lastFetchSuccessAt,
    ])
  },
)
