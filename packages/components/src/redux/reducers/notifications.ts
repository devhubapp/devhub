import {
  convertGitHubNotificationToDevHubGitHubNotification,
  DevHubGitHubNotification,
  LoadState,
} from '@devhub/core'
import immer from 'immer'
import _ from 'lodash'
import { REHYDRATE } from 'redux-persist'

import { Reducer } from '../types'

export interface State {
  allIds: string[]
  byId: Record<string, DevHubGitHubNotification | undefined>
  errorMessage: string | null
  lastFetchedAllRequestAt: string | null
  lastFetchedAllSuccessAt: string | null
  lastFetchedCount: number | null
  lastFetchedRequestAt: string | null
  lastFetchedSuccessAt: string | null
  latestPreventRefetchExisting: boolean | undefined
  latestWillFetchMore: boolean
  loadingState: LoadState | 'loading-all'
  newestItemDate: string | null
  oldestItemDate: string | null
  pendingEnhancementRequestsCount: number
}

const initialState: State = {
  allIds: [],
  byId: {},
  errorMessage: null,
  lastFetchedAllRequestAt: null,
  lastFetchedAllSuccessAt: null,
  lastFetchedCount: null,
  lastFetchedRequestAt: null,
  lastFetchedSuccessAt: null,
  latestPreventRefetchExisting: undefined,
  latestWillFetchMore: false,
  loadingState: 'not_loaded',
  newestItemDate: null,
  oldestItemDate: null,
  pendingEnhancementRequestsCount: 0,
}

export const notificationsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case REHYDRATE as any: {
      const { err, payload } = action as any

      const notifications: State = err
        ? state
        : payload && payload.notifications

      return {
        ...notifications,
        ..._.pick(initialState, [
          'errorMessage',
          'lastFetchedCount',
          'loadingState',
          'pendingEnhancementRequestsCount',
        ]),
      }
    }

    case 'FETCH_NOTIFICATIONS_REQUEST': {
      return immer(state, draft => {
        if (draft.loadingState !== 'loading-all') draft.loadingState = 'loading'
        draft.lastFetchedRequestAt = new Date().toISOString()

        draft.latestPreventRefetchExisting =
          action.payload.preventRefetchingExistingPayloads

        if (
          action.payload.fetchAllPages &&
          !action.payload.before &&
          !action.payload.since
        ) {
          draft.loadingState = 'loading-all'
          draft.lastFetchedAllRequestAt = draft.lastFetchedRequestAt
        }
      })
    }

    case 'FETCH_NOTIFICATIONS_FAILURE': {
      return immer(state, draft => {
        draft.errorMessage = (action.error && action.error.message) || ''
        draft.loadingState = 'error'
      })
    }

    case 'FETCH_NOTIFICATIONS_ABORT': {
      return immer(state, draft => {
        draft.latestWillFetchMore = false

        if (
          !draft.latestWillFetchMore &&
          !draft.pendingEnhancementRequestsCount &&
          (draft.loadingState === 'loading' ||
            draft.loadingState === 'loading-all')
        ) {
          draft.loadingState = 'loaded'
        }
      })
    }

    case 'FETCH_NOTIFICATIONS_ENHANCEMENTS_REQUEST': {
      return immer(state, draft => {
        draft.pendingEnhancementRequestsCount =
          (draft.pendingEnhancementRequestsCount || 0) + 1
      })
    }

    case 'FETCH_NOTIFICATIONS_SUCCESS':
    case 'FETCH_NOTIFICATIONS_ENHANCEMENTS_SUCCESS': {
      return immer(state, draft => {
        if (action.type === 'FETCH_NOTIFICATIONS_ENHANCEMENTS_SUCCESS') {
          draft.pendingEnhancementRequestsCount =
            (draft.pendingEnhancementRequestsCount || 0) - 1
        }

        if (action.type === 'FETCH_NOTIFICATIONS_SUCCESS') {
          draft.errorMessage = null
          if (
            !(
              draft.loadingState === 'loading-all' &&
              !(
                action.payload.requestParams &&
                action.payload.requestParams.fetchedCount
              )
            )
          ) {
            draft.lastFetchedCount =
              ((action.payload.requestParams &&
                action.payload.requestParams.fetchedCount) ||
                0) + action.payload.notifications.length
          }

          draft.lastFetchedSuccessAt = new Date().toISOString()

          if (
            !action.payload.willFetchMore &&
            action.payload.requestParams &&
            action.payload.requestParams.fetchAllPages &&
            !action.payload.requestParams.before &&
            !action.payload.requestParams.since
          ) {
            draft.lastFetchedAllSuccessAt = new Date().toISOString()
          }

          draft.latestWillFetchMore = action.payload.willFetchMore
          draft.latestPreventRefetchExisting =
            action.payload.requestParams.preventRefetchingExistingPayloads
        }

        if (
          !draft.latestWillFetchMore &&
          !draft.pendingEnhancementRequestsCount &&
          (draft.loadingState === 'loading' ||
            draft.loadingState === 'loading-all')
        ) {
          draft.loadingState = 'loaded'
        }

        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}
        const enhancedNotifications: DevHubGitHubNotification[] =
          action.type === 'FETCH_NOTIFICATIONS_SUCCESS'
            ? action.payload.notifications.map(notification =>
                convertGitHubNotificationToDevHubGitHubNotification(
                  notification,
                  { existingNotification: draft.byId[`${notification.id}`] },
                ),
              )
            : action.payload.enhancedNotifications

        enhancedNotifications.forEach(notification => {
          draft.byId[notification.id] = notification
          if (!draft.allIds.includes(`${notification.id}`)) {
            draft.allIds.push(`${notification.id}`)
          }
        })

        draft.allIds = draft.allIds
          .map(id => draft.byId[id])
          .filter(Boolean)
          .sort((a, b) =>
            a!.updatedAt > b!.updatedAt
              ? -1
              : a!.updatedAt < b!.updatedAt
              ? 1
              : 0,
          )
          .map(notification => `${notification!.id}`)

        draft.newestItemDate =
          (draft.allIds[0] &&
            draft.byId[draft.allIds[0]] &&
            draft.byId[draft.allIds[0]]!.updatedAt) ||
          null

        draft.oldestItemDate =
          (draft.allIds[draft.allIds.length - 1] &&
            draft.byId[draft.allIds[draft.allIds.length - 1]] &&
            draft.byId[draft.allIds[draft.allIds.length - 1]]!.updatedAt) ||
          null
      })
    }

    case 'FETCH_NOTIFICATIONS_ENHANCEMENTS_FAILURE': {
      return immer(state, draft => {
        draft.pendingEnhancementRequestsCount =
          (draft.pendingEnhancementRequestsCount || 0) - 1

        if (
          !draft.latestWillFetchMore &&
          !draft.pendingEnhancementRequestsCount &&
          (draft.loadingState === 'loading' ||
            draft.loadingState === 'loading-all')
        ) {
          draft.loadingState = 'loaded'
        }

        if (
          action.error &&
          action.error.message &&
          action.error.message.includes(
            'Something went wrong while executing your query',
          ) &&
          action.payload &&
          action.payload.notifications &&
          action.payload.notifications.length === 1 &&
          action.payload.notifications[0] &&
          action.payload.notifications[0].id
        ) {
          draft.byId = draft.byId || {}
          if (draft.byId[`${action.payload.notifications[0].id}`]) {
            draft.byId[
              `${action.payload.notifications[0].id}`
            ]!.isProbablyDeleted = true
          }
        }
      })
    }

    // this code is present on two reducers:
    // subscriptions and notifications
    case 'MARK_ITEMS_AS_READ_OR_UNREAD':
    case 'SAVE_ITEMS_FOR_LATER':
      return immer(state, draft => {
        if ('type' in action.payload && action.payload.type !== 'notifications')
          return
        if (
          !(
            action.payload.itemNodeIdOrIds &&
            action.payload.itemNodeIdOrIds.length
          )
        )
          return

        if (!draft.allIds) return
        if (!draft.byId) return

        const ids = Object.keys(draft.byId)
        if (!(ids && ids.length)) return

        const stringIds =
          action.payload.itemNodeIdOrIds &&
          action.payload.itemNodeIdOrIds
            .map(id => `${id || ''}`.trim())
            .filter(Boolean)
        if (!(stringIds && stringIds.length)) return

        ids.forEach(id => {
          const notification = draft.byId[id]
          if (!notification) return

          if (!stringIds.includes(`${notification.id}`)) return

          if (action.type === 'MARK_ITEMS_AS_READ_OR_UNREAD') {
            if (action.payload.unread) {
              if (action.payload.localOnly) notification.isUnreadUpstream = true
              notification.lastUnreadAt = new Date().toISOString()
            } else {
              if (!action.payload.localOnly)
                notification.isUnreadUpstream = false
              notification.lastReadAt = new Date().toISOString()
            }
          } else if (action.type === 'SAVE_ITEMS_FOR_LATER') {
            if (action.payload.save) {
              notification.lastSavedAt = new Date().toISOString()
            } else {
              notification.lastUnsavedAt = new Date().toISOString()
            }
          }
        })
      })

    default:
      return state
  }
}
