import {
  ColumnSubscription,
  GitHubAPIHeaders,
  GitHubAppTokenType,
} from '@devhub/core'
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
    [key: string]: string | number | boolean | undefined
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
  github: {
    appTokenType: GitHubAppTokenType
    headers: GitHubAPIHeaders
  }
}) {
  return createAction('FETCH_SUBSCRIPTION_SUCCESS', payload)
}

export function fetchSubscriptionFailure<E extends Error>(
  payload: {
    subscriptionType: ColumnSubscription['type']
    subscriptionId: string
    github: {
      appTokenType: GitHubAppTokenType
      headers: GitHubAPIHeaders
    }
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

export function markItemsAsReadOrUnread(payload: {
  type: ColumnSubscription['type']
  itemIds: Array<string | number>
  unread: boolean
  localOnly?: boolean
}) {
  return createAction('MARK_ITEMS_AS_READ_OR_UNREAD', payload)
}

export function markAllNotificationsAsReadOrUnread(payload: {
  unread: boolean
  localOnly?: boolean
}) {
  return createAction('MARK_ALL_NOTIFICATIONS_AS_READ_OR_UNREAD', payload)
}

export function markRepoNotificationsAsReadOrUnread(payload: {
  owner: string
  repo: string
  unread: boolean
  localOnly?: boolean
}) {
  return createAction('MARK_REPO_NOTIFICATIONS_AS_READ_OR_UNREAD', payload)
}

export function cleanupSubscriptionsData(
  payload: {
    deleteOlderThan?: string
    subscriptionIds?: string[]
  } = {},
) {
  return createAction('CLEANUP_SUBSCRIPTIONS_DATA', payload)
}
