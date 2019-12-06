import _ from 'lodash'
import memoizeState from 'memoize-state'
import { createSelectorCreator } from 'reselect'

export function shallowEqualityCheckOrDeepIfArray(a: unknown, b: unknown) {
  return a === b || (Array.isArray(a) && _.isEqual(a, b))
}

const refIsEqual = (a: any, b: any) => a === b

// tslint:disable-next-line ban-types
export function memoizeMultipleArguments<F extends Function>(
  func: F,
  equalityCheck = refIsEqual,
  cacheSize = 1,
): F {
  let cacheArr: Array<{ args: unknown[]; result: unknown }> = []
  const cacheMap: Map<string, { args: unknown[]; result: unknown }> = new Map()

  return (((...args: unknown[]) => {
    const allArgsArePrimitives = args.every(
      arg =>
        typeof arg === 'boolean' ||
        typeof arg === 'string' ||
        typeof arg === 'number' ||
        typeof arg === 'number' ||
        arg === null,
    )

    const cachedValue = allArgsArePrimitives
      ? cacheMap.get(JSON.stringify(args))
      : cacheArr.find(
          cache =>
            !!(
              cache &&
              cache.args.length === args.length &&
              args.every((arg, index) => equalityCheck(arg, cache.args[index]))
            ),
        )
    if (cachedValue) return cachedValue.result

    const result = func(...args)
    const lastResult = allArgsArePrimitives
      ? undefined
      : cacheArr[cacheArr.length - 1] && cacheArr[cacheArr.length - 1].result

    if (equalityCheck(result, lastResult)) return lastResult

    const _cacheSize = cacheSize >= 1 ? cacheSize : 1
    if (allArgsArePrimitives) {
      if (cacheMap.size - 1 >= _cacheSize) {
        let i = 0
        cacheMap.forEach((_value, key) => {
          i = i + 1
          if (i <= _cacheSize) cacheMap.delete(key)
        })
      }
      cacheMap.set(JSON.stringify(args), { args, result })
    } else {
      cacheArr = [{ args, result }].concat(cacheArr).splice(0, _cacheSize)
    }

    return result
  }) as any) as F
}

export const createDeepEqualSelector = createSelectorCreator(
  memoizeMultipleArguments,
  shallowEqualityCheckOrDeepIfArray,
)

export const createImmerSelector = memoizeState
