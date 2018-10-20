import { combineReducers } from 'redux'

import { appReducer } from './app'

export const rootReducer = combineReducers({
  app: appReducer,
})
