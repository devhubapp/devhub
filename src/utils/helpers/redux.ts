import { Action, ActionWithPayload } from '../../types'

export function createAction<T extends string>(type: T): Action<T>
export function createAction<T extends string, P>(
  type: T,
  payload: P,
): ActionWithPayload<T, P>
export function createAction<T extends string, P>(type: T, payload?: P) {
  return typeof payload === 'undefined' ? { type } : { type, payload }
}

export function createActionCreator<T extends string, P = void>(type: T) {
  return (payload: P) => createAction(type, payload)
}

// just a workaround for a good type checking without having to duplicate code
// while typescript doesnt support partial type argument inference
// see: https://stackoverflow.com/a/45514257/2228575
// see: https://github.com/Microsoft/TypeScript/pull/26349
export function createActionCreatorCreator<T extends string>(type: T) {
  return function creator<P = void>() {
    return createActionCreator<T, P>(type)
  }
}
