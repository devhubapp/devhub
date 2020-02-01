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
import { betterMemoize, createShallowEqualSelector } from './helpers'

const s = (state: RootState) => state.subscriptions || EMPTY_OBJ

export const subscriptionIdsSelector = (state: RootState) =>
  s(state).allIds || EMPTY_ARRAY

export const subscriptionsByIdSelector = (state: RootState) =>
  s(state).byId || EMPTY_OBJ

export const subscriptionSelector = (state: RootState, id: string) =>
  subscriptionsByIdSelector(state)[id] || undefined

export const allSubscriptionsArrSelector = createShallowEqualSelector(
  (state: RootState) => s(state).byId,
  (state: RootState) => subscriptionIdsSelector(state),
  (byId, subscriptionIds) => {
    if (!(byId && subscriptionIds && subscriptionIds.length)) return EMPTY_ARRAY

    return subscriptionIds
      .map(id => byId[id])
      .filter(Boolean) as ColumnSubscription[]
  },
)

export const userSubscriptionsArrSelector = createShallowEqualSelector(
  (state: RootState) => currentUserPlanSelector(state),
  (state: RootState) => columnsArrSelector(state),
  (state: RootState) => subscriptionsByIdSelector(state),
  (plan, columns, byId): ColumnSubscription[] => {
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
  createShallowEqualSelector(
    (_state: RootState, subscriptionIds: string[]) =>
      subscriptionIds || EMPTY_ARRAY,
    (state: RootState, _subscriptionIds: string[]) =>
      subscriptionsByIdSelector(state),
    (subscriptionIds, byId) => {
      return subscriptionIds
        .map(id => byId[id])
        .filter(Boolean) as ColumnSubscription[]
    },
  )

export const createSubscriptionsDataSelector = () => {
  const subscriptionsSelector = createSubscriptionsSelector()
  const memoizedGetItemsFromSubscriptions = betterMemoize(
    getItemsFromSubscriptions,
  )

  return createShallowEqualSelector(
    (state: RootState, subscriptionIds: string[]) =>
      subscriptionsSelector(state, subscriptionIds),
    (state: RootState, _subscriptionIds: string[]) => state.data.byId,
    (subscriptions, dataByNodeIdOrId) => {
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
    },
  )
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
