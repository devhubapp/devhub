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
