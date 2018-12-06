import { InferableComponentEnhancerWithProps } from 'react-redux'
import { Action as ReduxAction } from 'redux'

export interface Action<T extends string, P> extends ReduxAction<T> {
  payload: P
}

export interface ActionWithError<
  T extends string,
  P,
  E extends object = Record<string, any>
> extends Action<T, P> {
  payload: P
  error: E
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
  : (AC extends (payload: any) => infer A
      ? A
      : AC extends (payload: any, error: any) => infer A
      ? A
      : never)

export type ExtractPropsFromConnector<
  Connector
> = Connector extends InferableComponentEnhancerWithProps<infer T, any>
  ? T
  : never
