import immer from 'immer'

import { Modal, Reducer } from '../../types'

interface State {
  modalStack: Modal[]
}

const initialState: State = {
  modalStack: [],
}

export const navigationReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'PUSH_MODAL':
      return immer(state, draft => {
        if (draft.modalStack.slice(-1)[0] === action.payload) return
        draft.modalStack.push(action.payload)
      })

    case 'REPLACE_MODAL':
      return immer(state, draft => {
        draft.modalStack =
          draft.modalStack.length === 1 &&
          draft.modalStack[0] === action.payload
            ? []
            : [action.payload]
      })

    case 'POP_MODAL':
      return immer(state, draft => {
        draft.modalStack.pop()
      })

    case 'CLOSE_ALL_MODALS':
      return immer(state, draft => {
        draft.modalStack = []
      })

    default:
      return state
  }
}
