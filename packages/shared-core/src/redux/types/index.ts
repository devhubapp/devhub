import { ExtractActionFromActionCreator } from '../../types'

import * as actions from '../actions'

export type AllActions = ExtractActionFromActionCreator<
  typeof actions[keyof typeof actions]
>

export type Reducer<S = any> = (state: S | undefined, action: AllActions) => S
