import immer from 'immer'
import _ from 'lodash'

import { Column, Reducer } from '../../types'
import { guid } from '../../utils/helpers/shared'

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

        const id = guid()
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
          id => id === action.payload.id,
        )
        if (!(currentIndex >= 0 && currentIndex < draft.allIds.length)) return

        const newIndex = Math.max(
          0,
          Math.min(action.payload.index, draft.allIds.length - 1),
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

    default:
      return state
  }
}
