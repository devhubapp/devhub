import immer from 'immer'
import _ from 'lodash'

import {
  ActivityColumn,
  Column,
  NotificationColumn,
} from '@devhub/core/src/types'
import { guid } from '@devhub/core/src/utils/helpers/shared'
import { Reducer } from '../types'

export interface State {
  allIds: string[]
  byId: Record<string, Column> | null
}

const initialState: State = {
  allIds: [],
  byId: null,
}

export const columnsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'ADD_COLUMN':
      return immer(state, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        const { column, subscriptions } = action.payload

        const subscriptionIds = _.uniq(
          (column.subscriptionIds || []).concat(subscriptions.map(s => s.id)),
        ).filter(Boolean)

        const id = column.id || guid()
        draft.allIds.unshift(id)
        draft.byId[id] = {
          ...column,
          id,
          subscriptionIds,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      })

    case 'DELETE_COLUMN':
      return immer(state, draft => {
        if (draft.allIds)
          draft.allIds = draft.allIds.filter(id => id !== action.payload)

        if (draft.byId) delete draft.byId[action.payload]
      })

    case 'DELETE_COLUMN_SUBSCRIPTION':
      return immer(state, draft => {
        if (!(draft.allIds && draft.byId)) return

        draft.allIds.forEach(columnId => {
          if (!draft.byId![columnId].subscriptionIds) return

          draft.byId![columnId].subscriptionIds = draft.byId![
            columnId
          ].subscriptionIds.filter(id => id !== action.payload)
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
      })

    case 'REPLACE_COLUMNS':
      return immer(state, draft => {
        draft.byId = {}
        draft.allIds = action.payload.map(p => {
          draft.byId![p.column.id] = {
            ...p.column,
            subscriptionIds: p.column.subscriptionIds || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          return p.column.id
        })
      })

    case 'SET_COLUMN_ACTIVITY_TYPE_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId] as ActivityColumn
        if (!column) return

        column.filters = column.filters || {}
        column.filters.activity = column.filters.activity || {}
        column.filters.activity.types = column.filters.activity.types || {}

        if (typeof action.payload.value === 'boolean') {
          column.filters.activity.types[action.payload.type] =
            action.payload.value
        } else {
          delete column.filters.activity.types[action.payload.type]
        }
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
      })

    case 'SET_COLUMN_UNREAD_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId] as NotificationColumn
        if (!column) return

        column.filters = column.filters || {}
        column.filters.unread = action.payload.unread
      })

    case 'SET_COLUMN_PRIVACY_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.private = action.payload.private
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
      })

    default:
      return state
  }
}
