import _ from 'lodash'
import { combineReducers } from 'redux'

import { installationsReducer } from './installations'

const _rootReducer = combineReducers({
  installations: installationsReducer,
})

export const githubReducer = (state: any, action: any) => {
  switch (action.type) {
    default:
      return _rootReducer(state, action)
  }
}
