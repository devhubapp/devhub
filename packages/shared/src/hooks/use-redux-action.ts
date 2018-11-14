import { useContext } from 'react'
import { ReactReduxContext } from 'react-redux'
import { ActionCreator } from 'redux'

export function useReduxAction<AC extends ActionCreator<any>>(
  actionCreator: AC,
) {
  const { store } = useContext(ReactReduxContext)

  return (...args: AC extends (...args: infer Args) => any ? Args : any[]) => {
    store.dispatch(actionCreator(...args))
  }
}
