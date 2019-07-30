import { EMPTY_ARRAY, EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'

const s = (state: RootState) => state.navigation || EMPTY_OBJ

export const modalStack = (state: RootState) =>
  s(state).modalStack || EMPTY_ARRAY

export const currentOpenedModal = (state: RootState) =>
  modalStack(state) && modalStack(state)!.slice(-1)[0]
