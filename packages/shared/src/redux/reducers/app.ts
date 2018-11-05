import { Reducer } from '../../types'

export interface State {}

const initialState: State = {}

export const appReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}
