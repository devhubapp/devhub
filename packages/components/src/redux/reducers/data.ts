import {
  DevHubDataItemType,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  EnhancedItem,
  getItemDate,
  getItemNodeIdOrId,
  getItemOwnersAndRepos,
  isItemRead,
  isItemSaved,
  mergeEventPreservingEnhancement,
  mergeIssueOrPullRequestPreservingEnhancement,
  mergeNotificationPreservingEnhancement,
  removeUselessURLsFromResponseItem,
} from '@devhub/core'
import immer from 'immer'
import _ from 'lodash'

import { Reducer } from '../types'

export interface State {
  allIds: string[]
  byId: Record<
    string,
    | {
        type: DevHubDataItemType
        item: EnhancedItem | undefined
        subscriptionIds: string[]
        createdAt: string
        updatedAt: string
      }
    | undefined
  >
  idsBySubscriptionId: Record<string, string[]>
  idsByType: Partial<Record<DevHubDataItemType, string[]>>
  readIds: string[]
  savedIds: string[]
  updatedAt: string | undefined
}

const initialState: State = {
  allIds: [],
  byId: {},
  idsBySubscriptionId: {},
  idsByType: {},
  readIds: [],
  savedIds: [],
  updatedAt: undefined,
}

export const dataReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SUBSCRIPTION_SUCCESS':
      return immer(state, draft => {
        if (!draft.allIds) return
        if (!draft.byId) return

        const items = action.payload.data || []
        if (!(items && items.length)) return

        items.forEach(newItem => {
          const nodeIdOrId = getItemNodeIdOrId(newItem)
          if (!nodeIdOrId) return

          const now = new Date().toISOString()

          if (!draft.allIds.includes(nodeIdOrId)) draft.allIds.push(nodeIdOrId)

          if (!draft.byId[nodeIdOrId]) {
            draft.byId[nodeIdOrId] = {
              createdAt: now,
              item: undefined,
              subscriptionIds: [],
              type:
                action.payload.subscriptionType === 'activity'
                  ? 'event'
                  : action.payload.subscriptionType === 'notifications'
                  ? 'notification'
                  : action.payload.subscriptionType,
              updatedAt: now,
            }
          }

          const existingItem = draft.byId[nodeIdOrId]!.item
          const mergedItem = removeUselessURLsFromResponseItem(
            action.payload.subscriptionType === 'activity'
              ? mergeEventPreservingEnhancement(
                  newItem as EnhancedGitHubEvent,
                  existingItem as EnhancedGitHubEvent | undefined,
                )
              : action.payload.subscriptionType === 'issue_or_pr'
              ? mergeIssueOrPullRequestPreservingEnhancement(
                  newItem as EnhancedGitHubIssueOrPullRequest,
                  existingItem as EnhancedGitHubIssueOrPullRequest | undefined,
                )
              : action.payload.subscriptionType === 'notifications'
              ? mergeNotificationPreservingEnhancement(
                  newItem as EnhancedGitHubNotification,
                  existingItem as EnhancedGitHubNotification | undefined,
                )
              : newItem,
          )

          if (action.payload.github && action.payload.github.loggedUsername) {
            const actorLogin =
              mergedItem &&
              'actor' in mergedItem &&
              mergedItem.actor &&
              `${mergedItem.actor.login || ''}`.toLowerCase().trim()
            if (
              actorLogin &&
              action.payload.github.loggedUsername &&
              actorLogin ===
                action.payload.github.loggedUsername.toLowerCase().trim()
            ) {
              if (!mergedItem.last_unread_at && !mergedItem.last_read_at) {
                mergedItem.last_read_at = now
              }
            }
          }

          draft.byId[nodeIdOrId]!.item = mergedItem

          if (
            !draft.byId[nodeIdOrId]!.updatedAt ||
            !draft.byId[nodeIdOrId]!.item ||
            !getItemDate(draft.byId[nodeIdOrId]!.item) ||
            getItemDate(draft.byId[nodeIdOrId]!.item)! >
              draft.byId[nodeIdOrId]!.updatedAt
          ) {
            draft.byId[nodeIdOrId]!.updatedAt =
              getItemDate(draft.byId[nodeIdOrId]!.item) || now
          }

          if (action.payload.subscriptionId) {
            if (
              !draft.byId[nodeIdOrId]!.subscriptionIds.includes(
                action.payload.subscriptionId,
              )
            ) {
              draft.byId[nodeIdOrId]!.subscriptionIds.push(
                action.payload.subscriptionId,
              )
              draft.byId[nodeIdOrId]!.updatedAt = now
            }

            draft.idsBySubscriptionId[action.payload.subscriptionId] =
              draft.idsBySubscriptionId[action.payload.subscriptionId] || []
            if (
              !draft.idsBySubscriptionId[
                action.payload.subscriptionId
              ]!.includes(nodeIdOrId)
            ) {
              draft.idsBySubscriptionId[action.payload.subscriptionId]!.push(
                nodeIdOrId,
              )
              draft.updatedAt = now
            }

            draft.idsByType[draft.byId[nodeIdOrId]!.type] =
              draft.idsByType[draft.byId[nodeIdOrId]!.type] || []
            if (
              !draft.idsByType[draft.byId[nodeIdOrId]!.type]!.includes(
                nodeIdOrId,
              )
            ) {
              draft.idsByType[draft.byId[nodeIdOrId]!.type]!.push(nodeIdOrId)
              draft.updatedAt = now
            }

            const isRead = isItemRead(mergedItem)
            draft.readIds = draft.readIds || []
            if (isRead) {
              if (!draft.readIds.includes(nodeIdOrId)) {
                draft.readIds.push(nodeIdOrId)
                draft.updatedAt = now
              }
            } else {
              if (draft.readIds.includes(nodeIdOrId)) {
                draft.readIds = draft.readIds.filter(_id => _id !== nodeIdOrId)
                draft.updatedAt = now
              }
            }

            const isSaved = isItemSaved(mergedItem)
            draft.savedIds = draft.savedIds || []
            if (isSaved) {
              if (!draft.savedIds.includes(nodeIdOrId))
                draft.savedIds.push(nodeIdOrId)
            } else {
              if (draft.savedIds.includes(nodeIdOrId)) {
                draft.savedIds = draft.savedIds.filter(
                  _id => _id !== nodeIdOrId,
                )
                draft.updatedAt = now
              }
            }
          }
        })
      })

    case 'MARK_ITEMS_AS_READ_OR_UNREAD':
    case 'SAVE_ITEMS_FOR_LATER':
      return immer(state, draft => {
        if (
          !(
            action.payload.itemNodeIdOrIds &&
            action.payload.itemNodeIdOrIds.length
          )
        )
          return

        const now = new Date().toISOString()

        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        const stringIds =
          action.payload.itemNodeIdOrIds &&
          action.payload.itemNodeIdOrIds
            .map(id => `${id || ''}`.trim())
            .filter(Boolean)
        if (!(stringIds && stringIds.length)) return

        stringIds.forEach(id => {
          const entry = draft.byId[id]
          if (!(entry && entry.item)) return

          if (action.type === 'MARK_ITEMS_AS_READ_OR_UNREAD') {
            draft.readIds = draft.readIds || []
            if (!action.payload.unread) {
              if (!draft.readIds.includes(id)) draft.readIds.push(id)
              entry.item.last_read_at = now
              entry.updatedAt = now
            } else {
              if (draft.readIds.includes(id))
                draft.readIds = draft.readIds.filter(_id => _id !== id)
              entry.item.last_unread_at = now
              entry.updatedAt = now
            }
          } else if (action.type === 'SAVE_ITEMS_FOR_LATER') {
            draft.savedIds = draft.savedIds || []
            if (action.payload.save) {
              if (!draft.savedIds.includes(id)) draft.savedIds.push(id)
              entry.item.last_saved_at = now
              entry.updatedAt = now
            } else {
              if (draft.savedIds.includes(id))
                draft.savedIds = draft.savedIds.filter(_id => _id !== id)
              entry.item.last_unsaved_at = now
              entry.updatedAt = now
            }
          }
        })
      })

    case 'MARK_ALL_NOTIFICATIONS_AS_READ_OR_UNREAD':
    case 'MARK_REPO_NOTIFICATIONS_AS_READ_OR_UNREAD':
      return immer(state, draft => {
        const keys = Object.keys(draft.byId)
        if (!(keys && keys.length)) return

        const now = new Date().toISOString()

        keys.forEach(id => {
          const entry = draft.byId[id]
          if (!(entry && entry.type === 'notification' && entry.item)) return

          if (action.type === 'MARK_REPO_NOTIFICATIONS_AS_READ_OR_UNREAD') {
            const ownerAndRepo = getItemOwnersAndRepos(
              'notifications',
              entry.item,
            )[0]

            if (
              !(
                ownerAndRepo &&
                `${ownerAndRepo.owner || ''}`.toLowerCase() ===
                  `${action.payload.owner || ''}`.toLowerCase() &&
                `${ownerAndRepo.repo || ''}`.toLowerCase() ===
                  `${action.payload.repo || ''}`.toLowerCase()
              )
            )
              return
          }

          draft.readIds = draft.readIds || []
          if (!action.payload.unread) {
            if (!draft.readIds.includes(id)) draft.readIds.push(id)
            entry.item.last_read_at = now
            entry.updatedAt = now
          } else {
            if (draft.readIds.includes(id))
              draft.readIds = draft.readIds.filter(_id => _id !== id)
            entry.item.last_unread_at = now
            entry.updatedAt = now
          }

          entry.updatedAt = now

          draft.updatedAt = new Date().toISOString()
        })
      })

    default:
      return state
  }
}
