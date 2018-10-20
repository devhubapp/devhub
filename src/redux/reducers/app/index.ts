import { Reducer } from 'redux'

import pkg from '../../../../package.json'

interface State {
  version: string
}

const initialState: State = {
  version: pkg.version,
}

export const appReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}
