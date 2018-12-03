import { createSelector } from 'reselect'

import { RootState } from '../types'

const s = (state: RootState) => state.subscriptions || {}

export const subscriptionIdsSelector = (state: RootState) => s(state).allIds

export const createSubscriptionSelector = () =>
  createSelector(
    (state: RootState) => s(state).byId,
    (_state: RootState, id: string) => id,
    (byId, id) => byId && byId[id],
  )
