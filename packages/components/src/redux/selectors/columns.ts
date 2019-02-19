import { createSelector } from 'reselect'

import { RootState } from '../types'
import { createSubscriptionSelector } from './subscriptions'

const s = (state: RootState) => state.columns || {}

export const selectedColumnSelector = (state: RootState) =>
  s(state).selectedColumnId

export const createColumnSelector = () =>
  createSelector(
    (state: RootState) => s(state).byId,
    (_state: RootState, id: string) => id,
    (byId, id) => byId && byId[id],
  )

export const columnIdsSelector = (state: RootState) => s(state).allIds || []

export const columnsArrSelector = createSelector(
  (state: RootState) => columnIdsSelector(state),
  (state: RootState) => s(state).byId,
  (allIds, byId) => (byId ? allIds.map(id => byId[id]!).filter(Boolean) : []),
)

export const hasCreatedColumnSelector = (state: RootState) =>
  s(state).byId !== null

export const createColumnSubscriptionsSelector = () => {
  const columnSelector = createColumnSelector()
  const subscriptionSelector = createSubscriptionSelector()

  return createSelector(
    (state: RootState) => state.subscriptions,
    (state: RootState, id: string) =>
      columnSelector(state, id)
        ? columnSelector(state, id)!.subscriptionIds
        : [],
    (subscriptions, subscriptionIds) =>
      subscriptionIds
        .map(id => subscriptionSelector({ subscriptions } as any, id)!)
        .filter(Boolean),
  )
}

export const columnSubscriptionsSelector = createColumnSubscriptionsSelector()
