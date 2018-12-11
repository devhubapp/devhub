import { Dispatch, Reducer as ReduxReducer } from 'redux'

import { ExtractActionFromActionCreator } from './base'

import * as actions from '../actions'
import { rootReducer } from '../reducers'

export type AllActions = ExtractActionFromActionCreator<
  typeof actions[keyof typeof actions]
>

export type Reducer<S = any> = (state: S | undefined, action: AllActions) => S

export type RootState = typeof rootReducer extends ReduxReducer<infer S>
  ? S
  : never

export type Middleware = () => (
  next: Dispatch<AllActions>,
) => (action: AllActions) => any
