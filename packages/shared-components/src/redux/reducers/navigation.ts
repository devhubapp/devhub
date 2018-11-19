import immer from 'immer'

import { ModalPayload } from 'shared-core/dist/types'
import { Reducer } from '../types'

export interface State {
  modalStack: ModalPayload[]
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
        const currentModal = draft.modalStack.slice(-1)[0]
        if (currentModal && currentModal.name === action.payload.name) return
        draft.modalStack.push(action.payload)
      })

    case 'REPLACE_MODAL':
      return immer(state, draft => {
        draft.modalStack =
          draft.modalStack.length === 1 &&
          draft.modalStack[0] &&
          draft.modalStack[0].name === action.payload.name
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
