import _ from 'lodash'
import { createSelectorCreator } from 'reselect'

export function shallowEqualityCheckOrDeepIfArray(a: unknown, b: unknown) {
  return a === b || (Array.isArray(a) && _.isEqual(a, b))
}

// tslint:disable-next-line ban-types
export function memoizeResult<F extends Function>(
  func: F,
  equalityCheck = shallowEqualityCheckOrDeepIfArray,
): F {
  let lastArgs: unknown[] | null = null
  let lastResult: unknown | null = null
  const isEqualToLastArg = (value: any, index: number) =>
    equalityCheck(value, lastArgs && lastArgs[index])

  return (((...args: unknown[]) => {
    if (
      lastArgs === null ||
      lastArgs.length !== args.length ||
      !args.every(isEqualToLastArg)
    ) {
      const newResult = func(...args)

      if (!equalityCheck(newResult, lastResult)) {
        lastResult = newResult
      }
    }

    lastArgs = args
    return lastResult
  }) as any) as F
}

export const createDeepEqualSelector = createSelectorCreator(
  memoizeResult,
  _.isEqual,
)

// TODO: Make a new selector optimized for arrays whose item's refs don't change
export const createArraySelector = createDeepEqualSelector
