import { InferableComponentEnhancerWithProps } from 'react-redux'
import { Action as ReduxAction } from 'redux'

import * as actions from '../redux/actions'

export interface Action<T extends string> extends ReduxAction<T> {}

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P
}

export type ExtractPayloadFromActionCreator<AC> = AC extends () => any
  ? void
  : (AC extends (payload: infer P) => any ? P : never)

export type ExtractDispatcherFromActionCreator<
  AC
> = ExtractPayloadFromActionCreator<AC> extends void
  ? () => void
  : (payload: ExtractPayloadFromActionCreator<AC>) => void

export type ExtractActionFromActionCreator<AC> = AC extends () => infer A
  ? A
  : (AC extends (payload: any) => infer A ? A : never)

export type ExtractPropsFromConnector<
  Connector
> = Connector extends InferableComponentEnhancerWithProps<infer T, {}>
  ? T
  : never

export type AllActions = ExtractActionFromActionCreator<
  typeof actions[keyof typeof actions]
>

export type Reducer<S = any> = (state: S | undefined, action: AllActions) => S
