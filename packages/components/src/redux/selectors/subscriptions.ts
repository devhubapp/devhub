import _ from 'lodash'

import {
  ColumnSubscription,
  constants,
  getItemsFromSubscriptions,
} from '@devhub/core'
import { EMPTY_ARRAY, EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'
import { currentUserPlanSelector } from './auth'
import { columnsArrSelector } from './columns'
import { createArraySelector } from './helpers'

const s = (state: RootState) => state.subscriptions || EMPTY_OBJ

export const subscriptionIdsSelector = (state: RootState) =>
  s(state).allIds || EMPTY_ARRAY

export const subscriptionSelector = (state: RootState, id: string) =>
  (s(state).byId && s(state).byId[id]) || undefined

export const allSubscriptionsArrSelector = createArraySelector(
  (state: RootState) => subscriptionIdsSelector(state),
  (state: RootState) => s(state).byId,
  (ids, byId): ColumnSubscription[] =>
    byId && ids
      ? (ids.map(id => byId[id]).filter(Boolean) as ColumnSubscription[])
      : EMPTY_ARRAY,
)

export const userSubscriptionsArrSelector = createArraySelector(
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
  createArraySelector(
    (state: RootState, subscriptionIds: string[]) =>
      subscriptionIds
        .map(id => subscriptionSelector(state, id))
        .filter(Boolean) as ColumnSubscription[],
    subscriptions => {
      return getItemsFromSubscriptions(subscriptions)
    },
  )
