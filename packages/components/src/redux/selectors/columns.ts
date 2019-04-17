import { getColumnHeaderDetails } from '@devhub/core'
import { RootState } from '../types'
import { createArraySelector, createDeepEqualSelector } from './helpers'
import { subscriptionSelector } from './subscriptions'

const emptyArray: any[] = []
const emptyObj = {}

const s = (state: RootState) => state.columns || emptyObj

export const columnSelector = (state: RootState, id: string) => {
  if (!id) return

  const byId = s(state).byId
  return (byId && byId[id]) || undefined
}

export const columnIdsSelector = (state: RootState) =>
  s(state).allIds || emptyArray

export const columnsArrSelector = createArraySelector(
  (state: RootState) => columnIdsSelector(state),
  (state: RootState) => s(state).byId,
  (ids, byId) =>
    byId && ids ? ids.map(id => byId[id]).filter(Boolean) : emptyArray,
)

export const hasCreatedColumnSelector = (state: RootState) =>
  s(state).byId !== null

export const columnSubscriptionsSelector = createArraySelector(
  (state: RootState, columnId: string) => {
    const column = columnSelector(state, columnId)
    return (column && column.subscriptionIds) || emptyArray
  },
  (state: RootState) => state.subscriptions,
  (subscriptionIds, subscriptions) =>
    subscriptionIds
      .map(subscriptionId =>
        subscriptionSelector({ subscriptions } as any, subscriptionId),
      )
      .filter(Boolean),
)

export const columnSubscriptionSelector = (
  state: RootState,
  columnId: string,
) => columnSubscriptionsSelector(state, columnId).slice(-1)[0] || undefined

export const columnHeaderDetailsSelector = createDeepEqualSelector(
  (state: RootState, columnId: string) => columnSelector(state, columnId),
  (state: RootState, columnId: string) => {
    const column = columnSelector(state, columnId)
    if (!column) return undefined

    const subscription = columnSubscriptionSelector(state, columnId)
    return subscription
  },
  (column, subscription) => getColumnHeaderDetails(column, subscription),
)
