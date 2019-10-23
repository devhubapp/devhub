import _ from 'lodash'

import {
  ColumnSubscription,
  constants,
  getItemsFromSubscriptions,
} from '@devhub/core'
import { createSelector } from 'reselect'
import { EMPTY_ARRAY, EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'
import { currentUserPlanSelector } from './auth'
import { columnsArrSelector } from './columns'

const s = (state: RootState) => state.subscriptions || EMPTY_OBJ

export const subscriptionIdsSelector = (state: RootState) =>
  s(state).allIds || EMPTY_ARRAY

export const subscriptionSelector = (state: RootState, id: string) =>
  (s(state).byId && s(state).byId[id]) || undefined

export const allSubscriptionsArrSelector = createSelector(
  (state: RootState) => subscriptionIdsSelector(state),
  (state: RootState) => s(state).byId,
  (ids, byId): ColumnSubscription[] =>
    byId && ids
      ? (ids.map(id => byId[id]).filter(Boolean) as ColumnSubscription[])
      : EMPTY_ARRAY,
)

export const userSubscriptionsArrSelector = createSelector(
  (state: RootState) => currentUserPlanSelector(state),
  (state: RootState) => columnsArrSelector(state),
  (state: RootState) => s(state).byId,
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

export const createSubscriptionsDataSelector = () =>
  createSelector(
    (state: RootState, subscriptionIds: string[]) =>
      subscriptionIds
        .map(id => subscriptionSelector(state, id))
        .filter(Boolean) as ColumnSubscription[],
    (state: RootState, _subscriptionIds: string[]) => state.data.byId,
    (subscriptions, dataByNodeIdOrId) => {
      const getItemByNodeIdOrId = (nodeIdOrId: string) =>
        dataByNodeIdOrId &&
        dataByNodeIdOrId[nodeIdOrId] &&
        dataByNodeIdOrId[nodeIdOrId]!.item
      const result = getItemsFromSubscriptions(
        subscriptions,
        getItemByNodeIdOrId,
      )
      if (!(result && result.length)) return EMPTY_ARRAY
      return result
    },
  )
