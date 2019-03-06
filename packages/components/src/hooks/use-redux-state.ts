import { useEffect, useRef, useState } from 'react'

import { useReduxStore } from '../redux/context/ReduxStoreContext'
import { RootState } from '../redux/types'

export type ExtractSelector<S> = S extends (state: any) => infer R
  ? (state: RootState) => R
  : (state: RootState) => any

type Result<S> = S extends (...args: any[]) => infer R ? R : any

export function useReduxState<S extends (state: any) => any>(
  selector: S,
  callback?: (value: Result<S>) => void,
) {
  const store = useReduxStore()

  const [result, setResult] = useState<Result<S>>(() =>
    selector(store.getState()),
  )

  const cacheRef = useRef(result)

  useEffect(() => {
    if (callback) callback(result)
  }, [])

  useEffect(() => {
    update()

    return store.subscribe(() => {
      update()
    })
  }, [store, selector])

  function update() {
    if (!selector) {
      resolve(undefined as any)
      return
    }

    const newResult = selector(store.getState())
    resolve(newResult)
  }

  const resolve = (value: Result<S>) => {
    if (cacheRef.current === value) return

    cacheRef.current = value

    if (callback) {
      callback(value)
      return
    }

    setResult(value)
  }

  return result
}
