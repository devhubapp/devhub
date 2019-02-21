import immer from 'immer'
import _ from 'lodash'

import {
  ActivityColumn,
  Column,
  columnsArrToState,
  NotificationColumn,
  subscriptionsArrToState,
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

        const subscriptionIds = subscriptionsArrToState(
          action.payload.subscriptions,
        ).allIds

        const normalized = columnsArrToState([
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

        Object.assign(draft.byId, normalized.byId)

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
        const normalized = columnsArrToState(
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
