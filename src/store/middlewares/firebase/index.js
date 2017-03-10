/* global __DEV__ */

import * as firebase from 'firebase';
import { debounce } from 'lodash';

import { FIREBASE_RECEIVED_EVENT } from '../../../utils/constants/actions';
import { firebaseReceivedEvent } from '../../../actions';
import { fromJS, toJS } from '../../../utils/immutable';
import { applyPatchOnFirebase, getObjectDiff, watchFirebaseFromMap } from './lib';
import { isReadySelector } from '../../../selectors';

let _currentUserId;
let _databaseRef;
let _lastState;

export const map = {
  config: {},
  entities: {
    columns: {},
    subscriptions: {},
  },
  user: {
    isLogging: false,
  },
};

const checkDiffAndPatchDebounced = debounce(
  store => {
    if (_databaseRef && _lastState !== undefined) {
      const stateDiff = toJS(getObjectDiff(_lastState, store.getState(), map));

      // console.log('state diff', stateDiff);

      if (stateDiff) {
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
  firebase.auth().signOut();

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
      callback({ eventName, fullPath, value }) {
        if (_lastState === undefined) return;
        store.dispatch(firebaseReceivedEvent({ eventName, fullPath, value }));
        _lastState = store.getState();
      },
      debug: __DEV__,
      map,
      ref: _databaseRef,
    });
  }, (...args) => {
    console.error('[FIREBASE] Something went wrong getting data from the server', ...args);
    _lastState = null;
  });
}

export default store => next => action => {
  const isAppReady = isReadySelector(store.getState());

  if (!isAppReady || action.type === FIREBASE_RECEIVED_EVENT) {
    next(action);
    return;
  }

  const user = firebase.auth().currentUser;
  const userId = (user || {}).uid;

  if (userId !== _currentUserId) {
    _currentUserId = userId;

    if (userId) {
      startFirebase({ store, userId });
    } else {
      stopFirebase();
    }
  }

  next(action);
  checkDiffAndPatchDebounced(store);
};
