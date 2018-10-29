import immer from 'immer'

import { Reducer } from '../../types'

interface State {
  modalStack: string[]
}

const initialState: State = {
  modalStack: [],
}

export const navigationReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return immer(state, draft => {
        draft.modalStack.push(action.payload)
      })

    case 'POP_MODAL':
      return immer(state, draft => {
        draft.modalStack.pop()
      })

    default:
      return state
  }
}
