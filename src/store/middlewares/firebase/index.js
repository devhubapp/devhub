/* global __DEV__ */

import * as firebase from 'firebase';
import { debounce } from 'lodash';

import { FIREBASE_RECEIVED_EVENT } from '../../../utils/constants/actions';
import { firebaseReceivedEvent } from '../../../actions';
import { fromJS, toJS } from '../../../utils/immutable';
import { applyPatchOnFirebase, getObjectDiff, watchFirebaseFromMap } from './lib';
import { isLoggedSelector, isReadySelector } from '../../../selectors';

let _currentUserId;
let _databaseRef;
let _lastState;

export const mapStateToFirebase = {
  config: {},
  entities: {
    columns: {},
    subscriptions: {},
  },
  user: {
    isLogging: false,
  },
};

export const mapFirebaseToState = {
  config: {},
  entities: {
    columns: {},
    subscriptions: {},
  },
};

const checkDiffAndPatchDebounced = debounce(
  store => {
    if (_databaseRef && _lastState !== undefined) {
      const stateDiff = toJS(getObjectDiff(_lastState, store.getState(), mapStateToFirebase));

      // console.log('state diff', stateDiff);

      if (stateDiff && _currentUserId) {
        applyPatchOnFirebase({ debug: __DEV__, patch: stateDiff });
        _lastState = store.getState();
      }
    }
  },
  300,
);

export function stopFirebase() {
  if (!_databaseRef) return;

  console.debug('[FIREBASE] Disconnected.');
  _databaseRef.off();

  _databaseRef = undefined;
  _lastState = undefined;
}

export function startFirebase({ store, userId }) {
  stopFirebase();

  _databaseRef = firebase.database().ref(`users/${userId}/`);
  console.debug('[FIREBASE] Connected.');

  _databaseRef.once('value', snapshot => {
    _lastState = fromJS(snapshot.val()) || null;

    watchFirebaseFromMap({
      callback({ eventName, firebasePathArr, statePathArr, value }) {
        if (_lastState === undefined) return;
        store.dispatch(firebaseReceivedEvent({ eventName, firebasePathArr, statePathArr, value }));
        _lastState = store.getState();
      },
      debug: __DEV__,
      map: mapFirebaseToState,
      ref: _databaseRef,
    });
  }, (...args) => {
    console.error('[FIREBASE] Something went wrong getting data from the server', ...args);
    _lastState = null;
  });
}

export default store => next => action => {
  next(action);

  const isAppReady = isReadySelector(store.getState());

  if (!isAppReady || action.type === FIREBASE_RECEIVED_EVENT) {
    return;
  }

  const isLogged = isLoggedSelector(store.getState());
  const userId = isLogged && (firebase.auth().currentUser || {}).uid;

  if (userId !== _currentUserId) {
    _currentUserId = userId;

    if (userId) {
      startFirebase({ store, userId });
    } else {
      stopFirebase();
    }
  }

  checkDiffAndPatchDebounced(store);
};
