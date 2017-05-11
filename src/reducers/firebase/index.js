// @flow

import app from '../app'
import config from '../config'
import entities from '../entities'
import user from '../user'

import {
  getObjectDiff,
  getObjectFilteredByMap,
  getSubMapFromPath,
} from '../../store/middlewares/firebase/helpers'
import { FIREBASE_RECEIVED_EVENT } from '../../utils/constants/actions'
import { fromJS, getIn, mergeDeepIn } from '../../utils/immutable'
import type { Action } from '../../utils/types'

export const mapFirebaseToState = {
  config: {},
  entities: {
    columns: {},
    subscriptions: {
      '*': {
        error: false,
        events: false,
        lastModifiedAt: false,
        loading: false,
        pollInterval: false,
        rateLimit: false,
        rateLimitRemaining: false,
        rateLimitReset: false,
        updatedAt: false,
      },
    },
  },
}

export const mapStateToFirebase = {
  app: {
    ready: false,
    rehydrated: false,
  },
  config: {},
  entities: {
    columns: {},
    subscriptions: {
      '*': {
        error: false,
        events: false,
        lastModifiedAt: false,
        loading: false,
        pollInterval: false,
        rateLimit: false,
        rateLimitRemaining: false,
        rateLimitReset: false,
        updatedAt: false,
      },
    },
  },
  user: {
    accessToken: false,
    isLogging: false,
  },
}

const initialState = fromJS(
  getObjectFilteredByMap(
    {
      app: app(),
      config: config(),
      entities: entities(),
      user: user(),
    },
    mapStateToFirebase,
  ),
)

type State = {}

// Improtant: Differently from all other reducers,
// this one is not on the /firebase path,
// instead this points to the root state of the whole app.
// check the file reducers/index.js to understand

export default (
  state: State = initialState,
  { type, payload }: ?Action<any> = {},
): State => {
  switch (type) {
    case FIREBASE_RECEIVED_EVENT:
      return (({ eventName, statePathArr, value }) => {
        if (!Array.isArray(statePathArr)) return state

        switch (eventName) {
          case 'child_removed':
            return state.removeIn(statePathArr)
          default:
            return (() => {
              const filteredState = getObjectFilteredByMap(
                state,
                mapFirebaseToState,
              )

              const sameLevelFilteredState = getIn(filteredState, statePathArr)

              let valueDiff

              if (
                eventName === 'child_added' &&
                sameLevelFilteredState === undefined
              ) {
                valueDiff = getObjectFilteredByMap(
                  value,
                  getSubMapFromPath(mapStateToFirebase, statePathArr),
                )
              } else if (typeof value === 'object') {
                valueDiff = getObjectDiff(
                  sameLevelFilteredState,
                  value,
                  getSubMapFromPath(mapStateToFirebase, statePathArr),
                )
              } else {
                valueDiff = value
              }

              return fromJS(
                mergeDeepIn(
                  state,
                  statePathArr,
                  fromJS(valueDiff),
                  eventName !== 'value',
                ),
              )
            })()
        }
      })(payload || {})

    default:
      return state
  }
}
