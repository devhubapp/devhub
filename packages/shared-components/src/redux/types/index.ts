import { Reducer as ReduxReducer } from 'redux'

import { ExtractActionFromActionCreator } from 'shared-core/dist/types'

import * as actions from '../actions'
import { rootReducer } from '../reducers'

export type AllActions = ExtractActionFromActionCreator<
  typeof actions[keyof typeof actions]
>

export type Reducer<S = any> = (state: S | undefined, action: AllActions) => S

export type RootState = typeof rootReducer extends ReduxReducer<infer S>
  ? S
  : never
