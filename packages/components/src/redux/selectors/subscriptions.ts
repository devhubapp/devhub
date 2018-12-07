import { createSelector } from 'reselect'

import { RootState } from '../types'

const s = (state: RootState) => state.subscriptions || {}

export const subscriptionIdsSelector = (state: RootState) =>
  s(state).allIds || []

export const createSubscriptionSelector = () =>
  createSelector(
    (state: RootState) => s(state).byId,
    (_state: RootState, id: string) => id,
    (byId, id) => byId && byId[id],
  )

export const subscriptionSelector = createSubscriptionSelector()

export const subscriptionsSelector = (state: RootState) =>
  subscriptionIdsSelector(state)
    .map(id => subscriptionSelector(state, id))
    .filter(Boolean)
