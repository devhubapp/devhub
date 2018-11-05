import immer from 'immer'
import { REHYDRATE } from 'redux-persist'

import { Column, Reducer } from '../../types'
import { columnsSelector } from '../selectors'

export interface State {
  columns?: Column[]
}

const initialState: State = {}

export const columnsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case REHYDRATE as any:
      return immer(state, draft => {
        const columns =
          columnsSelector((action.payload as any) || {}) || draft.columns

        if (columns) draft.columns = columns.filter(c => c && c.id)
      })
    case 'ADD_COLUMN':
      return immer(state, draft => {
        draft.columns = draft.columns || []
        draft.columns = [action.payload, ...draft.columns]
      })

    case 'DELETE_COLUMN':
      return immer(state, draft => {
        if (!draft.columns) return
        draft.columns = draft.columns.filter(c => c.id !== action.payload)
      })

    case 'MOVE_COLUMN':
      return immer(state, draft => {
        if (!draft.columns) return

        const currentIndex = draft.columns.findIndex(
          c => c.id === action.payload.id,
        )
        const newIndex = action.payload.index

        if (!(currentIndex >= 0 && currentIndex < draft.columns.length)) return
        if (!(newIndex >= 0 && newIndex < draft.columns.length)) return

        // move column inside array
        const column = draft.columns[currentIndex]
        draft.columns = draft.columns.filter(c => c !== column)
        draft.columns.splice(newIndex, 0, column)
      })

    case 'REPLACE_COLUMNS':
      return immer(state, draft => {
        draft.columns = action.payload
      })

    default:
      return state
  }
}
