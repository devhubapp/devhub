import immer from 'immer'
import _ from 'lodash'

import {
  ActivityColumn,
  Column,
  filterRecordHasAnyForcedValue,
  normalizeColumns,
  normalizeSubscriptions,
  NotificationColumn,
} from '@devhub/core'
import { Reducer } from '../types'

export interface State {
  allIds: string[]
  byId: Record<string, Column | undefined> | null
  updatedAt: string | null
}

const initialState: State = {
  allIds: [],
  byId: null,
  updatedAt: null,
}

export const columnsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'ADD_COLUMN_AND_SUBSCRIPTIONS':
      return immer(state, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        const subscriptionIds = normalizeSubscriptions(
          action.payload.subscriptions,
        ).allIds

        const normalized = normalizeColumns([
          {
            ...action.payload.column,
            subscriptionIds: _.uniq(
              (action.payload.column.subscriptionIds || []).concat(
                subscriptionIds,
              ),
            ),
          },
        ])

        if (!(normalized.allIds.length === 1)) return

        draft.allIds.push(normalized.allIds[0])

        _.merge(draft.byId, normalized.byId)

        draft.updatedAt = normalized.updatedAt
      })

    case 'ADD_COLUMN_SUBSCRIPTION':
      return immer(state, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        if (!action.payload.columnId) return
        if (!(action.payload.subscription && action.payload.subscription.id))
          return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.subscriptionIds = _.uniq(
          column.subscriptionIds.concat(action.payload.subscription.id),
        )

        draft.updatedAt = new Date().toISOString()
      })

    case 'REMOVE_SUBSCRIPTION_FROM_COLUMN':
      return immer(state, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        if (!action.payload.columnId) return
        if (!action.payload.subscriptionId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.subscriptionIds = column.subscriptionIds.filter(
          id => id !== action.payload.subscriptionId,
        )

        draft.updatedAt = new Date().toISOString()
      })

    case 'DELETE_COLUMN':
      return immer(state, draft => {
        if (draft.allIds)
          draft.allIds = draft.allIds.filter(
            id => id !== action.payload.columnId,
          )

        if (draft.byId) delete draft.byId[action.payload.columnId]

        draft.updatedAt = new Date().toISOString()
      })

    case 'DELETE_COLUMN_SUBSCRIPTIONS':
      return immer(state, draft => {
        if (!(draft.allIds && draft.byId)) return

        draft.allIds.forEach(columnId => {
          const column = draft.byId && draft.byId[columnId]
          if (!column) return

          column.subscriptionIds = column.subscriptionIds.filter(
            id => !action.payload.includes(id),
          )

          draft.updatedAt = new Date().toISOString()
        })
      })

    case 'MOVE_COLUMN':
      return immer(state, draft => {
        if (!draft.allIds) return

        const currentIndex = draft.allIds.findIndex(
          id => id === action.payload.columnId,
        )
        if (!(currentIndex >= 0 && currentIndex < draft.allIds.length)) return

        const newIndex = Math.max(
          0,
          Math.min(action.payload.columnIndex, draft.allIds.length - 1),
        )
        if (Number.isNaN(newIndex)) return

        // move column inside array
        const columnId = draft.allIds[currentIndex]
        draft.allIds = draft.allIds.filter(id => id !== columnId)
        draft.allIds.splice(newIndex, 0, columnId)

        draft.updatedAt = new Date().toISOString()
      })

    case 'REPLACE_COLUMNS_AND_SUBSCRIPTIONS':
      return immer(state, draft => {
        const normalized = normalizeColumns(
          action.payload.columns,
          action.payload.columnsUpdatedAt,
        )

        draft.allIds = normalized.allIds
        draft.byId = normalized.byId

        draft.updatedAt = normalized.updatedAt
      })

    case 'SET_COLUMN_SAVED_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId] as NotificationColumn
        if (!column) return

        column.filters = column.filters || {}

        if (typeof action.payload.saved !== 'undefined') {
          column.filters.saved =
            typeof action.payload.saved === 'boolean'
              ? action.payload.saved
              : undefined
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_PARTICIPATING_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId] as NotificationColumn
        if (!column) return

        column.filters = column.filters || {}
        column.filters.notifications = column.filters.notifications || {}
        column.filters.notifications.participating =
          action.payload.participating

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_ACTIVITY_ACTION_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId] as ActivityColumn
        if (!column) return

        column.filters = column.filters || {}
        column.filters.activity = column.filters.activity || {}
        column.filters.activity.actions = column.filters.activity.actions || {}

        if (typeof action.payload.value === 'boolean') {
          column.filters.activity.actions[action.payload.type] =
            action.payload.value
        } else {
          delete column.filters.activity.actions[action.payload.type]
        }

        if (!filterRecordHasAnyForcedValue(column.filters.activity.actions)) {
          column.filters.activity.actions = {}
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_REASON_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId] as NotificationColumn
        if (!column) return

        column.filters = column.filters || {}
        column.filters.notifications = column.filters.notifications || {}

        column.filters.notifications.reasons =
          column.filters.notifications.reasons || {}

        if (typeof action.payload.value === 'boolean') {
          column.filters.notifications.reasons[action.payload.reason] =
            action.payload.value
        } else {
          delete column.filters.notifications.reasons[action.payload.reason]
        }

        if (
          !filterRecordHasAnyForcedValue(column.filters.notifications.reasons)
        ) {
          column.filters.notifications.reasons = {}
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_STATE_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.state = column.filters.state || {}

        if (action.payload.supportsOnlyOne) {
          column.filters.state = {}

          if (action.payload.value === true) {
            column.filters.state[action.payload.state] = action.payload.value
          }
        } else if (typeof action.payload.value === 'boolean') {
          column.filters.state[action.payload.state] = action.payload.value
        } else {
          delete column.filters.state[action.payload.state]
        }

        if (!filterRecordHasAnyForcedValue(column.filters.state)) {
          column.filters.state = {}
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_DRAFT_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.draft = action.payload.draft

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_SUBJECT_TYPE_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.subjectTypes = column.filters.subjectTypes || {}

        if (typeof action.payload.value === 'boolean') {
          ;(column.filters.subjectTypes as any)[action.payload.subjectType] =
            action.payload.value
        } else {
          delete (column.filters.subjectTypes as any)[
            action.payload.subjectType
          ]
        }

        if (!filterRecordHasAnyForcedValue(column.filters.subjectTypes)) {
          column.filters.subjectTypes = {}
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_OWNER_FILTER':
      return immer(state, draft => {
        const { columnId, value } = action.payload

        const owner = `${action.payload.owner || ''}`.toLowerCase()

        if (!draft.byId) return

        const column = draft.byId[columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.owners = column.filters.owners || {}

        column.filters.owners[owner] = column.filters.owners[owner] || {
          value: undefined,
          repos: {},
        }

        if (typeof value === 'boolean') {
          column.filters.owners[owner]!.value = value
        } else {
          column.filters.owners[owner]!.value = undefined

          if (
            !filterRecordHasAnyForcedValue(column.filters.owners[owner]!.repos)
          ) {
            delete column.filters.owners[owner]
          }
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_REPO_FILTER':
      return immer(state, draft => {
        const { columnId, value } = action.payload

        const owner = `${action.payload.owner || ''}`.toLowerCase()
        const repo = `${action.payload.repo || ''}`.toLowerCase()

        if (!draft.byId) return

        const column = draft.byId[columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.owners = column.filters.owners || {}

        column.filters.owners[owner] = column.filters.owners[owner] || {
          value: undefined,
          repos: {},
        }
        column.filters.owners[owner]!.repos =
          column.filters.owners[owner]!.repos || {}

        if (typeof value === 'boolean') {
          column.filters.owners[owner]!.repos![repo] = value
        } else {
          delete column.filters.owners[owner]!.repos![repo]
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_UNREAD_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId] as NotificationColumn
        if (!column) return

        column.filters = column.filters || {}
        column.filters.unread = action.payload.unread

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_PRIVACY_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.private = action.payload.private

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_CLEARED_AT_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.clearedAt =
          action.payload.clearedAt === null
            ? undefined
            : action.payload.clearedAt || new Date().toISOString()

        draft.updatedAt = new Date().toISOString()
      })

    default:
      return state
  }
}
