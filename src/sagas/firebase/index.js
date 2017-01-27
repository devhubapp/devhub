// @flow

import * as firebase from 'firebase';
import { mapKeys } from 'lodash';
import { fork, select, take } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';

import { deepImmutableEqualityCheck, get, getIn, toJS } from '../../utils/immutable';

import { isLoggedSelector } from '../../selectors';

const firebaseCharMap = { '/': '__STRIPE__' };

// firebase does not support some characters as object key, like '/'
function fixFirebaseKeys(value, key) {
  let fixedKey = key;

  Object.keys(firebaseCharMap).forEach(char => {
    if (fixedKey.indexOf(char) >= 0) {
      const find = new RegExp(char, 'g');
      const replace = get(firebaseCharMap, char);

      fixedKey = fixedKey.replace(find, replace);
    }
  });

  return fixedKey;
}

function sync(firebasePath, value) {
  if (!firebasePath) return;

  const mutableValue = toJS(value);
  const fixedValue = mapKeys(mutableValue, fixFirebaseKeys);
  firebase.database().ref(firebasePath).set(fixedValue);
}

function syncIfChanged(newState, oldState, statePath, firebasePath, forceSync) {
  if (!(newState && oldState && Array.isArray(statePath) && firebasePath)) {
    return;
  }

  const newValue = getIn(newState, statePath);
  const oldValue = getIn(oldState, statePath);
  if (!newValue) return;

  if (forceSync || newValue !== oldValue) {
    sync(firebasePath, newValue, oldValue);
  } else {
    firebase.database().ref(firebasePath).once('value', snapshot => {
      const remoteValue = snapshot.val();

      if (!remoteValue || !deepImmutableEqualityCheck(remoteValue, newValue)) {
        sync(firebasePath, newValue, oldValue);
      }
    });
  }
}

function* startFirebaseWatcher() {
  let user;
  let state;

  yield take(REHYDRATE);

  while (true) {
    yield take('*');

    const newState = yield select();
    const oldState = state;

    const newUser = firebase.auth().currentUser;
    const oldUser = user;

    const userId = get(newUser || {}, 'uid');
    if (!userId) continue;

    const isLogged = yield isLoggedSelector(newState);
    if (!isLogged) continue;

    const hasChangedUser = userId !== get(oldUser || {}, 'uid');

    // sync changes with firebase
    syncIfChanged(
      newState,
      oldState,
      ['config'],
      `users/${userId}/config`,
      hasChangedUser,
    );

    syncIfChanged(
      newState,
      oldState,
      ['entities', 'columns'],
      `users/${userId}/entities/columns`,
      hasChangedUser,
    );

    syncIfChanged(
      newState,
      oldState,
      ['entities', 'subscriptions'],
      `users/${userId}/entities/subscriptions`,
      hasChangedUser,
    );

    syncIfChanged(
      newState,
      state,
      ['user'],
      `users/${userId}/user`,
      hasChangedUser,
    );

    state = newState;
    user = newUser;
  }
}

export default function* () {
  return yield [yield fork(startFirebaseWatcher)];
}
