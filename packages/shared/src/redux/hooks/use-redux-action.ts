import { useContext } from 'react'
import { ReactReduxContext } from 'react-redux'

type ActionCreator = (...args: any) => any

export function useReduxAction<AC extends ActionCreator>(actionCreator: AC) {
  const { store } = useContext(ReactReduxContext)

  return (
    ...args: AC extends ((...args: infer Args) => any) ? Args : any[]
  ) => {
    store.dispatch(actionCreator(...(args as any[])))
  }
}
