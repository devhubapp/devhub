import { combineReducers } from 'redux'

import { appReducer } from './app'
import { configReducer } from './config'

export const rootReducer = combineReducers({
  app: appReducer,
  config: configReducer,
})
