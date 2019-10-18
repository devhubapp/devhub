import {
  DevHubGitHubNotification,
  fetchNotifications,
  fetchNotificationsEnhancements,
  GitHubNotification,
} from '@devhub/core'

import {
  createAction,
  createErrorAction,
  createErrorActionWithPayload,
} from '../helpers'

export function fetchNotificationsRequest(
  payload: Omit<
    Parameters<typeof fetchNotifications>[0] &
      Parameters<typeof fetchNotificationsEnhancements>[1],
    'accessToken' | 'existingNotificationsById'
  > & {
    fetchAllPages?: boolean
    fetchedCount?: number
    maxFetchLimit?: number
  } = {},
) {
  // if (__DEV__) payload.maxFetchLimit = 200 // TODO: Remove
  return createAction('FETCH_NOTIFICATIONS_REQUEST', payload)
}

export function fetchNotificationsSuccess(payload: {
  notifications: GitHubNotification[]
  requestParams: Parameters<typeof fetchNotificationsRequest>[0] & {
    accessToken: string
  }
  willFetchMore: boolean
}) {
  return createAction('FETCH_NOTIFICATIONS_SUCCESS', payload)
}

export function fetchNotificationsFailure<E extends Error>(
  error: E & { status?: number },
) {
  return createErrorAction('FETCH_NOTIFICATIONS_FAILURE', error)
}

export function fetchNotificationsAbort() {
  return createAction('FETCH_NOTIFICATIONS_ABORT')
}

export function preFetchNotificationsEnhancementsRequest(payload: {
  notifications: GitHubNotification[]
  requestParams: Parameters<typeof fetchNotificationsRequest>[0]
  willFetchMore: boolean
}) {
  return createAction('PRE_FETCH_NOTIFICATIONS_ENHANCEMENTS_REQUEST', payload)
}

export function fetchNotificationsEnhancementsRequest(payload: {
  notifications: Parameters<typeof fetchNotificationsEnhancements>[0]
  params: Omit<
    Parameters<typeof fetchNotificationsSuccess>[0]['requestParams'],
    'existingNotificationsById'
  >
  willFetchMore: boolean
}) {
  return createAction('FETCH_NOTIFICATIONS_ENHANCEMENTS_REQUEST', payload)
}

export function fetchNotificationsEnhancementsSuccess(payload: {
  enhancedNotifications: DevHubGitHubNotification[]
  requestParams: Parameters<
    typeof fetchNotificationsEnhancementsRequest
  >[0]['params']
  willFetchMore: boolean
}) {
  return createAction('FETCH_NOTIFICATIONS_ENHANCEMENTS_SUCCESS', payload)
}

export function fetchNotificationsEnhancementsFailure<E extends Error>(
  payload: Parameters<typeof fetchNotificationsEnhancementsRequest>[0],
  error: E & { status?: number },
) {
  return createErrorActionWithPayload(
    'FETCH_NOTIFICATIONS_ENHANCEMENTS_FAILURE',
    payload,
    error,
  )
}
