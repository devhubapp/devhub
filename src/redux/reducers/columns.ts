import immer from 'immer'

import { Column, Reducer } from '../../types'

interface State {
  columns?: Column[]
}

const initialState: State = {}

export const columnsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'ADD_COLUMN':
      return immer(state, draft => {
        draft.columns = draft.columns || []
        draft.columns = [action.payload, ...draft.columns]
      })

    case 'DELETE_COLUMN':
      return immer(state, draft => {
        if (!draft.columns) return
        draft.columns = draft.columns.filter(
          column => column.id !== action.payload,
        )
      })

    case 'REPLACE_COLUMNS':
      return immer(state, draft => {
        draft.columns = action.payload
      })

    default:
      return state
  }
}
