import { useContext } from 'react'

import { ReduxStoreContext } from '../context/ReduxStoreContext'

type ActionCreator = (...args: any) => any

export function useReduxAction<AC extends ActionCreator>(actionCreator: AC) {
  const store = useContext(ReduxStoreContext)

  return (
    ...args: AC extends ((...args: infer Args) => any) ? Args : any[]
  ) => {
    store.dispatch(actionCreator(...(args as any[])))
  }
}
