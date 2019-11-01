import immer from 'immer'

import { ModalPayloadWithIndex } from '@devhub/core'
import { Reducer } from '../types'

export interface State {
  modalStack: Array<ModalPayloadWithIndex | undefined>
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

        const payload = { ...action.payload, index: draft.modalStack.length }
        draft.modalStack.push(payload)
      })

    case 'REPLACE_MODAL':
      return immer(state, draft => {
        if (
          draft.modalStack.length === 1 &&
          draft.modalStack[0] &&
          draft.modalStack[0].name === action.payload.name
        ) {
          draft.modalStack = []
        } else {
          const payload = { ...action.payload, index: 0 }
          draft.modalStack = [payload]
        }
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
