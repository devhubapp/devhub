// @flow

import { fromJS, Map } from 'immutable'
import { combineReducers } from 'redux-immutable'

import columns from './columns'
import comments from './comments'
import commits from './commits'
import events from './events'
import issues from './issues'
import orgs from './orgs'
import notifications from './notifications'
import releases from './releases'
import repos from './repos'
import subscriptions from './subscriptions'
import users from './users'

import {
  RESET_APP_DATA,
  LOAD_SUBSCRIPTION_DATA_SUCCESS,
  LOAD_NOTIFICATIONS_SUCCESS,
} from '../../utils/constants/actions'

import type { Action } from '../../utils/types'

const reducer = combineReducers({
  columns,
  comments,
  commits,
  events,
  issues,
  notifications,
  orgs,
  releases,
  repos,
  subscriptions,
  users,
})

const initialState = Map()

const indexReducer = (state: Object = initialState, action) => {
  const { type, payload } = action || {}

  switch (type) {
    case RESET_APP_DATA:
      return initialState

    case LOAD_SUBSCRIPTION_DATA_SUCCESS:
    case LOAD_NOTIFICATIONS_SUCCESS:
      return (_payload => {
        const { data: { entities } = {} } = _payload || {}
        if (!entities) return state

        return state.mergeDeep(fromJS(entities))
      })(payload)

    default:
      return state
  }
}

export default (state: Object = initialState, action: Action<Object>) => {
  const stateAfterIndexReducer = indexReducer(state, action)
  return reducer(stateAfterIndexReducer, action)
}
