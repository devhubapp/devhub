import _ from 'lodash'
import { combineReducers } from 'redux'

import { githubAPIReducer } from './api'
import { githubAuthReducer } from './auth'
import { githubInstallationsReducer } from './installations'

export const githubReducer = combineReducers({
  api: githubAPIReducer,
  auth: githubAuthReducer,
  installations: githubInstallationsReducer,
})
