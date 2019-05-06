import _ from 'lodash'
import { combineReducers } from 'redux'

import { appReducer } from './app'
import { authReducer } from './auth'
import { columnsReducer } from './columns'
import { configReducer } from './config'
import { githubReducer } from './github'
import { navigationReducer } from './navigation'
import { subscriptionsReducer } from './subscriptions'

const _rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  columns: columnsReducer,
  config: configReducer,
  github: githubReducer,
  navigation: navigationReducer,
  subscriptions: subscriptionsReducer,
})

export const rootReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'LOGOUT':
      return _rootReducer(_.pick(state, 'config') as any, action)

    default:
      return _rootReducer(state, action)
  }
}
