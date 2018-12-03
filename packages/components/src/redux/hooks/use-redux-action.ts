import { useReduxStore } from '../context/ReduxStoreContext'

type ActionCreator = (...args: any) => any

export function useReduxAction<AC extends ActionCreator>(actionCreator: AC) {
  const store = useReduxStore()

  return (
    ...args: AC extends ((...args: infer Args) => any) ? Args : any[]
  ) => {
    store.dispatch(actionCreator(...(args as any[])))
  }
}
