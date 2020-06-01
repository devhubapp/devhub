import {
  Column,
  ColumnSubscription,
  EnhancedItem,
  GitHubAPIHeaders,
  GitHubAppTokenType,
} from '@devhub/core'
import { createAction, createErrorActionWithPayload } from '../helpers'

export function fetchSubscriptionRequest(payload: {
  subscriptionType: ColumnSubscription['type']
  subscriptionId: string
  replaceAllItems: boolean
  params: {
    [key: string]: string | number | boolean | Record<string, any> | undefined
    since?: string
    page?: number
    perPage?: number
  }
}) {
  return createAction('FETCH_SUBSCRIPTION_REQUEST', payload)
}

export function fetchSubscriptionSuccess(payload: {
  subscriptionType: ColumnSubscription['type']
  subscriptionId: string
  data: EnhancedItem[] | undefined
  canFetchMore: boolean | undefined
  replaceAllItems: boolean
  github: {
    appTokenType: GitHubAppTokenType
    loggedUsername: string
    headers: GitHubAPIHeaders
  }
}) {
  return createAction('FETCH_SUBSCRIPTION_SUCCESS', payload)
}

export function fetchSubscriptionFailure<E extends Error>(
  payload: {
    subscriptionType: ColumnSubscription['type']
    subscriptionId: string
    replaceAllItems: boolean
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
export function fetchColumnSubscriptionRequest(payload: {
  columnId: string
  replaceAllItems: boolean
  params: Parameters<typeof fetchSubscriptionRequest>[0]['params']
}) {
  return createAction('FETCH_COLUMN_SUBSCRIPTIONS', payload)
}

export function deleteColumnSubscriptions(subscriptionIds: string[]) {
  return createAction('DELETE_COLUMN_SUBSCRIPTIONS', subscriptionIds)
}

export function saveItemsForLater(payload: {
  itemNodeIdOrIds: string[]
  save?: boolean
}) {
  return createAction('SAVE_ITEMS_FOR_LATER', payload)
}

export function markItemsAsReadOrUnread(payload: {
  type: ColumnSubscription['type']
  itemNodeIdOrIds: string[]
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

export function markEverythingAsReadWithConfirmation() {
  return createAction('MARK_EVERYTHING_AS_READ_WITH_CONFIRMATION')
}

export function markEverythingAsRead() {
  return createAction('MARK_EVERYTHING_AS_READ')
}

export function openItem(payload: {
  columnId: Column['id']
  columnType: Column['type']
  itemNodeIdOrId: string
  link: string | undefined
}) {
  return createAction('OPEN_ITEM', payload)
}
