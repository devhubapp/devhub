import _ from 'lodash'
import { shallowEqual } from 'react-redux'
import { createSelectorCreator } from 'reselect'

// Better Memoize supports a custom equality check function and a custom cache size.
// Is also re-runs the equality checks in the final result
// to avoid changing the result reference when possible.
// eslint-disable-next-line @typescript-eslint/ban-types
export function betterMemoize<F extends Function>(
  func: F,
  equalityCheck = shallowEqual,
  cacheSize = 1,
): F {
  let cacheArr: { args: unknown[]; result: unknown }[] = []
  const cacheMap: Map<string, { args: unknown[]; result: unknown }> = new Map()

  return ((...args: unknown[]) => {
    const allArgsArePrimitives = args.every(
      (arg) =>
        typeof arg === 'boolean' ||
        typeof arg === 'string' ||
        typeof arg === 'number' ||
        typeof arg === 'number' ||
        arg === null,
    )

    const cachedValue = allArgsArePrimitives
      ? cacheMap.get(JSON.stringify(args))
      : cacheArr.find(
          (cache) =>
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
  }) as any as F
}

export const createShallowEqualSelector = createSelectorCreator(betterMemoize)
