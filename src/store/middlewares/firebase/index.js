/* global __DEV__ */

import * as firebase from 'firebase';

import { watchFirebaseFromMap } from './lib';
import { firebaseReceivedEvent } from '../../../actions';

let _currentUserId;
let _databaseRef;

export function stopFirebase() {
  if (_databaseRef) {
    console.debug('[FIREBASE] Disconnected.');
    _databaseRef.off();
  }
}

export function startFirebase({ dispatch, userId }) {
  stopFirebase();

  _databaseRef = firebase.database().ref(`users/${userId}/`);

  watchFirebaseFromMap({
    callback({ eventName, fullPath, value }) {
      dispatch(firebaseReceivedEvent({ eventName, fullPath, value }));
    },
    debug: __DEV__,
    map: {
      config: {},
      entities: {
        columns: {},
        subscriptions: {},
      },
      user: {
        isLogging: false,
      },
    },
    ref: _databaseRef,
  });
}

export default store => next => action => {
  const user = firebase.auth().currentUser;
  const userId = (user || {}).uid;

  if (userId !== _currentUserId) {
    _currentUserId = userId;

    if (userId) {
      startFirebase({ dispatch: store.dispatch, userId });
    } else {
      stopFirebase();
    }
  }

  next(action);
};
