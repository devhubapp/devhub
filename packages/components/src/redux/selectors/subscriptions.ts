import _ from 'lodash'

import { ColumnSubscription, getItemsFromSubscriptions } from '@devhub/core'
import { EMPTY_ARRAY, EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'
import { createArraySelector } from './helpers'

const s = (state: RootState) => state.subscriptions || EMPTY_OBJ

export const subscriptionIdsSelector = (state: RootState) =>
  s(state).allIds || EMPTY_ARRAY

export const subscriptionSelector = (state: RootState, id: string) =>
  (s(state).byId && s(state).byId[id]) || undefined

export const subscriptionsArrSelector = createArraySelector(
  (state: RootState) => subscriptionIdsSelector(state),
  (state: RootState) => s(state).byId,
  (ids, byId): ColumnSubscription[] =>
    byId && ids
      ? (ids.map(id => byId[id]).filter(Boolean) as ColumnSubscription[])
      : EMPTY_ARRAY,
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
