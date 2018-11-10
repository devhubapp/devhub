import immer from 'immer'

import { Column, Reducer } from '../../types'

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

        draft.allIds.unshift(action.payload.id)
        draft.byId[action.payload.id] = action.payload
      })

    case 'DELETE_COLUMN':
      return immer(state, draft => {
        if (draft.allIds)
          draft.allIds = draft.allIds.filter(id => id !== action.payload)

        if (draft.byId) delete draft.byId[action.payload]
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
        draft.allIds = action.payload.map(c => {
          draft.byId![c.id] = c
          return c.id
        })
      })

    default:
      return state
  }
}
