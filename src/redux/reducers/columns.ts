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
    case 'REPLACE_COLUMNS':
      return immer(state, draft => {
        draft.columns = action.payload
      })

    default:
      return state
  }
}
