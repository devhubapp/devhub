import { Action, ActionWithError } from '../../types'

export function createAction<T extends string>(type: T): Action<T, void>
export function createAction<T extends string, P>(
  type: T,
  payload: P,
): Action<T, P>
export function createAction<T extends string, P>(type: T, payload?: P) {
  return typeof payload === 'undefined' ? { type } : { type, payload }
}

export function createErrorAction<T extends string, E extends object>(
  type: T,
  error: E,
): ActionWithError<T, void, E>
export function createErrorAction<
  T extends string,
  E extends object = Record<string, any>
>(type: T, error?: E) {
  return { type, error }
}

export function createActionCreator<T extends string, P = void>(type: T) {
  return (...args: P extends void ? [] : [P]) => createAction(type, args[0])
}

export function createErrorActionCreator<
  T extends string,
  E extends object = Record<string, any>
>(type: T) {
  return (error: E) => createErrorAction(type, error)
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
