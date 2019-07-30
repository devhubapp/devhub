import { EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'

export const countersSelector = (state: RootState) =>
  state.counters || EMPTY_OBJ
