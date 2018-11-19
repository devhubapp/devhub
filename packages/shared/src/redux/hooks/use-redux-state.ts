import { useContext, useEffect, useState } from 'react'

import { RootState } from '../../types'
import { ReduxStoreContext } from '../context/ReduxStoreContext'

export type ExtractSelector<S> = S extends (state: any) => infer R
  ? (state: RootState) => R
  : (state: RootState) => any

export function useReduxState<S extends (state: any) => any>(selector: S) {
  type Result =
    | (S extends (...args: any[]) => infer R ? R | undefined : any)
    | undefined

  const store = useContext(ReduxStoreContext)
  const getResult = (): Result => selector(store.getState())
  const [result, setResult] = useState(getResult())

  useEffect(
    () => {
      return store.subscribe(() => {
        if (!selector) {
          setResult(undefined)
          return
        }

        const newResult = getResult()
        if (newResult === result) return

        setResult(newResult)
      })
    },
    [store],
  )

  return result
}
