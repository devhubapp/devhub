import { ColumnSubscription, GitHubApiHeaders } from '@devhub/core'
import { createAction, createErrorActionWithPayload } from '../helpers'

export function fetchColumnSubscriptionRequest(payload: {
  columnId: string
  params: {
    [key: string]: string | number | undefined
    page: number
    perPage?: number
  }
}) {
  return createAction('FETCH_COLUMN_SUBSCRIPTIONS', payload)
}

export function deleteColumnSubscriptions(subscriptionIds: string[]) {
  return createAction('DELETE_COLUMN_SUBSCRIPTIONS', subscriptionIds)
}

export function fetchSubscriptionRequest(payload: {
  subscriptionType: ColumnSubscription['type']
  subscriptionId: string
  params: {
    [key: string]: string | number | undefined
    page: number
    perPage?: number
  }
}) {
  return createAction('FETCH_SUBSCRIPTION_REQUEST', payload)
}

export function fetchSubscriptionSuccess(payload: {
  subscriptionType: ColumnSubscription['type']
  subscriptionId: string
  data: any
  canFetchMore: boolean
  github: GitHubApiHeaders
}) {
  return createAction('FETCH_SUBSCRIPTION_SUCCESS', payload)
}

export function fetchSubscriptionFailure<E extends Error>(
  payload: {
    subscriptionType: ColumnSubscription['type']
    subscriptionId: string
    github: GitHubApiHeaders | undefined
  },
  error: E & { status?: number },
) {
  return createErrorActionWithPayload(
    'FETCH_SUBSCRIPTION_FAILURE',
    payload,
    error,
  )
}

export function saveItemsForLater(payload: {
  itemIds: Array<string | number>
  save?: boolean
}) {
  return createAction('SAVE_ITEMS_FOR_LATER', payload)
}

export function cleanupSubscriptionsData(
  payload: {
    deleteOlderThan?: string
    subscriptionIds?: string[]
  } = {},
) {
  return createAction('CLEANUP_SUBSCRIPTIONS_DATA', payload)
}
