import { RootState } from '../types'

const emptyArray: any[] = []
const emptyObj = {}

const s = (state: RootState) => state.navigation || emptyObj

export const modalStack = (state: RootState) =>
  s(state).modalStack || emptyArray

export const currentOpenedModal = (state: RootState) =>
  modalStack(state) && modalStack(state)!.slice(-1)[0]
