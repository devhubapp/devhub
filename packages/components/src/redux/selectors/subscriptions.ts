import _ from 'lodash'

import { ColumnSubscription, getItemsFromSubscriptions } from '@devhub/core'
import { RootState } from '../types'
import { createArraySelector } from './helpers'

const emptyArray: any[] = []
const emptyObj = {}

const s = (state: RootState) => state.subscriptions || emptyObj

export const subscriptionIdsSelector = (state: RootState) =>
  s(state).allIds || emptyArray

export const subscriptionSelector = (state: RootState, id: string) =>
  (s(state).byId && s(state).byId[id]) || undefined

export const subscriptionsArrSelector = createArraySelector(
  (state: RootState) => subscriptionIdsSelector(state),
  (state: RootState) => s(state).byId,
  (ids, byId): ColumnSubscription[] =>
    byId && ids ? ids.map(id => byId[id]).filter(Boolean) : emptyArray,
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
