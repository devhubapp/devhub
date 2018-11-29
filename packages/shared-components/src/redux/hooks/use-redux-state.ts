import { useEffect, useState } from 'react'

import { useReduxStore } from '../context/ReduxStoreContext'
import { RootState } from '../types'

export type ExtractSelector<S> = S extends (state: any) => infer R
  ? (state: RootState) => R
  : (state: RootState) => any

export function useReduxState<S extends (state: any) => any>(selector: S) {
  type Result = S extends (...args: any[]) => infer R ? R : any

  const store = useReduxStore()
  const [result, setResult] = useState<Result>(() => selector(store.getState()))

  useEffect(
    () => {
      return store.subscribe(() => {
        if (!selector) {
          setResult(undefined as any)
          return
        }

        const newResult = selector(store.getState())
        if (Object.is(newResult, result)) return

        setResult(newResult)
      })
    },
    [store, result],
  )

  return result
}
