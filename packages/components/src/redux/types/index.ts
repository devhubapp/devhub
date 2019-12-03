import { Dispatch, MiddlewareAPI } from 'redux'

import { ExtractActionFromActionCreator, ExtractStateFromReducer } from './base'

import * as actions from '../actions'
import { rootReducer } from '../reducers'

export type AllActions = ExtractActionFromActionCreator<
  typeof actions[keyof typeof actions]
>

export type Reducer<S = any> = (state: S | undefined, action: AllActions) => S

export type RootState = ExtractStateFromReducer<typeof rootReducer>

export type Middleware = (
  store: MiddlewareAPI,
) => (next: Dispatch<AllActions>) => (action: AllActions) => any
