import _ from 'lodash'
import { useCallback, useEffect, useRef } from 'react'
import { useStore } from 'react-redux'

import { RootState } from '../redux/types'
import { useForceRerender } from './use-force-rerender'

export type ExtractSelector<S> = S extends (state: any) => infer R
  ? (state: RootState) => R
  : (state: RootState) => any

type Result<S> = S extends (...args: any[]) => infer R ? R : any

export function useReduxStateCallback<S extends (state: any) => any>(
  selector: S,
  callback: (value: Result<S>) => void,
  { skipFirstCallback }: { skipFirstCallback?: boolean } = {},
) {
  const store = useStore()
  const forceRerender = useForceRerender()

  const result = selector(store.getState())
  const cacheRef = useRef<Result<S>>(result)
  cacheRef.current = result

  const resolve = useCallback(
    (value: Result<S>) => {
      if (cacheRef.current === value || _.isEqual(cacheRef.current, value))
        return

      cacheRef.current = value

      if (callback) {
        callback(value)
        return
      }

      forceRerender()
    },
    [callback],
  )

  const update = useCallback(() => {
    if (!selector) {
      resolve(undefined as any)
      return
    }

    const newResult = selector(store.getState())
    resolve(newResult)
  }, [resolve, store, selector])

  useEffect(() => {
    update()

    return store.subscribe(() => {
      update()
    })
  }, [store, update])

  useEffect(() => {
    if (callback && !skipFirstCallback) callback(cacheRef.current)
  })

  return cacheRef.current
}
