import { RootState } from '../../types'

const s = (state: RootState) => state.navigation || {}

export const modalStack = (state: RootState) => s(state).modalStack

export const currentOpenedModal = (state: RootState) =>
  modalStack(state).slice(-1)[0]
