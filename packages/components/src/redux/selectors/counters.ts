import { RootState } from '../types'

const emptyObj = {}

const s = (state: RootState) => state.counters || emptyObj

export const loginCountSelector = (state: RootState) => s(state).loginSuccess
