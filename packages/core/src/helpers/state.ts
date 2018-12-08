import {
  Column,
  ColumnCreation,
  ColumnSubscription,
  ColumnSubscriptionCreation,
} from '..'
import { getUniqueIdForSubscription, guid } from '../utils'

export function columnsArrToState(columns: ColumnCreation[]) {
  const items = columns || []
  const byId: Record<string, Column> = {}

  const allIds = items.map((column: ColumnCreation) => {
    const id = column.id || guid()

    byId[id] = {
      ...column,
      id,
      subscriptionIds: column.subscriptionIds || [],
      createdAt: column.createdAt || new Date().toISOString(),
      updatedAt: column.updatedAt || new Date().toISOString(),
    }

    return id
  })

  return { allIds, byId }
}

export function subscriptionsArrToState(
  subscriptions: ColumnSubscriptionCreation[],
) {
  const items = subscriptions || []
  const byId: Record<string, ColumnSubscription> = {}
  const allIds = items.map((subscription: ColumnSubscriptionCreation) => {
    const id = subscription.id || getUniqueIdForSubscription(subscription)
    byId[id] = {
      ...subscription,
      id,
      data: subscription.data || {},
      createdAt: subscription.createdAt || new Date().toISOString(),
      updatedAt: subscription.updatedAt || new Date().toISOString(),
    } as ColumnSubscription

    return id
  })

  return { allIds, byId }
}
