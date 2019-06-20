import { RootState } from '../types'

const emptyObj = {}

export const countersSelector = (state: RootState) => state.counters || emptyObj
