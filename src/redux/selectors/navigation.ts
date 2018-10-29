import { RootState } from '../../types'

const s = (state: RootState) => state.navigation

export const currentOpenedModal = (state: RootState) =>
  s(state).modalStack.slice(-1)[0]
