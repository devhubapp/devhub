import { debounce } from 'lodash'

import firebase from '../../../libs/firebase'
import {
  RESET_ACCOUNT_DATA,
  FIREBASE_RECEIVED_EVENT,
} from '../../../utils/constants/actions'
import {
  firebaseAuthStateChanged,
  firebaseReceivedEvent,
} from '../../../actions'
import {
  mapFirebaseToState,
  mapStateToFirebase,
} from '../../../reducers/firebase'
import { getIn, toJS } from '../../../utils/immutable'
import {
  getObjectDiff,
  getObjectFilteredByMap,
  getMapSubtractedByMap,
} from './helpers'
import {
  addFirebaseListener,
  applyPatchOnFirebase,
  watchFirebaseFromMap,
} from './lib'
import { isLoggedSelector, isReadySelector } from '../../../selectors'

let _currentUserId
let _databaseRef
let _lastState

const checkDiffAndPatchDebounced = debounce((stateA, stateB, map, store) => {
  if (_databaseRef && stateA !== undefined) {
    const stateDiff = toJS(getObjectDiff(stateA, stateB, map))
    // console.log('state diff', stateDiff)
    // console.log('states before diff', toJS(stateA), toJS(stateA))

    if (stateDiff && _currentUserId) {
      applyPatchOnFirebase({
        debug: false, // __DEV__,
        patch: stateDiff,
        ref: _databaseRef,
        rootDatabaseRef: _databaseRef,
      })
      _lastState = store.getState()
    }
  }
}, 300)

export function stopFirebase() {
  if (!_databaseRef) return

  _databaseRef.off()
  if (__DEV__) console.debug('[FIREBASE] Disconnected.')

  _databaseRef = undefined
  _lastState = undefined
}

export function startFirebase({ store, userId }) {
  stopFirebase()

  _databaseRef = firebase.database().ref(`users/${userId}`)
  if (__DEV__) console.debug('[FIREBASE] Connected.')

  // get all the data on firebase and compare with the local state.
  // upload to firebase the fields that are different, but not all of them,
  // just the ones that we will naver get from firebase again
  // (which means the difference from mapStateToFirebase and mapFirebaseToState)
  // e.g. these fields will be uploaded: app/version, user/loggedAt, ...
  // because we'll never get theses fields from firebase, we just upload them.
  // they are more 'local' fields that doesnt make sense to sync.
  addFirebaseListener({
    callback(result) {
      let missingOnFirebaseMap = getMapSubtractedByMap(
        mapStateToFirebase,
        mapFirebaseToState,
      )

      if (missingOnFirebaseMap === null)
        missingOnFirebaseMap = mapFirebaseToState

      const firebaseData = getObjectFilteredByMap(
        result.value,
        missingOnFirebaseMap,
      )
      const localData = getObjectFilteredByMap(
        store.getState(),
        missingOnFirebaseMap,
      )

      if (!firebaseData || !localData) return

      // send to firebase some things from the initial state, like app.version, ...
      checkDiffAndPatchDebounced(
        firebaseData,
        localData,
        missingOnFirebaseMap,
        store,
      )

      // update local state with the initial data received by firebase
      store.dispatch(firebaseReceivedEvent(result))
      _lastState = store.getState()

      watchFirebaseFromMap({
        callback({ eventName, firebasePathArr, statePathArr, value }) {
          store.dispatch(
            firebaseReceivedEvent({
              eventName,
              firebasePathArr,
              statePathArr,
              value,
            }),
          )
          _lastState = store.getState()
        },
        debug: false, // __DEV__,

        // ignore the first child_added because it is redundant,
        // we already got this using ref.once('value')
        ignoreFn: ({ count, eventName, statePathArr }) =>
          count === 1 &&
          eventName === 'child_added' &&
          _lastState &&
          getIn(_lastState, statePathArr) !== undefined,
        map: mapFirebaseToState,
        ref: _databaseRef,
        rootDatabaseRef: _databaseRef,
      })
    },
    debug: false, // __DEV__,
    eventName: 'value',
    map: mapFirebaseToState,
    once: true,
    ref: _databaseRef,
    rootDatabaseRef: _databaseRef,
  })
}

export default store => {
  firebase.auth().onAuthStateChanged(user => {
    store.dispatch(firebaseAuthStateChanged(user))
  })

  return next => (action = {}) => {
    next(action)

    const isAppReady = isReadySelector(store.getState())

    if (!isAppReady || action.type === FIREBASE_RECEIVED_EVENT) {
      return
    }

    if (action.type === RESET_ACCOUNT_DATA && _databaseRef) {
      if (__DEV__) console.debug('[FIREBASE] Reseting account data...')
      _databaseRef.update({ config: null, entities: null }, e => {
        if (!__DEV__) return

        if (e) console.error('[FIREBASE] Failed to reset account data', e)
        else console.debug('[FIREBASE] Reseted.')
      })
    }

    const isLogged = isLoggedSelector(store.getState())
    const userId = isLogged && (firebase.auth().currentUser || {}).uid

    if (userId !== _currentUserId) {
      _currentUserId = userId

      if (userId) {
        startFirebase({ store, userId })
      } else {
        stopFirebase()
        return
      }
    }

    checkDiffAndPatchDebounced(
      _lastState,
      store.getState(),
      mapStateToFirebase,
      store,
    )
  }
}
