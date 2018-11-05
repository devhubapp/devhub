import { combineReducers } from 'redux'

import { appReducer } from './app'
import { authReducer } from './auth'
import { columnsReducer } from './columns'
import { configReducer } from './config'
import { navigationReducer } from './navigation'

const _rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  columns: columnsReducer,
  config: configReducer,
  navigation: navigationReducer,
})

export const rootReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'LOGOUT':
      return _rootReducer(undefined, action)

    default:
      return _rootReducer(state, action)
  }
}
