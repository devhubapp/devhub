// @flow

import * as firebase from 'firebase';
import { delay } from 'redux-saga';
import { call, fork, put, takeLatest } from 'redux-saga/effects';

import OAuthManager from '../utils/oauth';

import {
  LOGIN_REQUEST,
  LOGOUT,
} from '../utils/constants/actions';

import type { Action, LoginRequestPayload } from '../utils/types';

import {
  loginSuccess,
  loginFailure,
  updateCurrentUser,
} from '../actions';

const sagaActionChunk = { dispatchedBySaga: true };

function* login({ payload }: Action<LoginRequestPayload>) {
  try {
    const { provider, ...params } = payload;

    const response = yield call(OAuthManager.authorize, provider, params);
    const { response: { credentials: { accessToken } = {} } = {} } = response || {};
    // console.log('response', response);

    if (!accessToken) {
      throw new Error('Login failed: No access token received.', 'NoAccessTokenException');
    }

    // sign in with firebase
    const credential = firebase.auth.GithubAuthProvider.credential(accessToken);
    firebase.auth().signInWithCredential(credential).catch(console.log);

    const result = { accessToken };
    yield put(loginSuccess(payload, result, sagaActionChunk));
  } catch (e) {
    console.log('Login failed', e);
    const errorMessage = (e.message || {}).message || e.message || e.body || e.status;
    yield put(loginFailure(payload, errorMessage, sagaActionChunk));
  }
}

function logout() {
  try {
    firebase.auth().signOut();
  } catch (e) {
    console.error('Failed to logout', e);
  }
}

function* watchFirebaseCurrentUser() {
  const ignoreValue = 'ignore';
  let lastUser = ignoreValue;

  firebase.auth().onAuthStateChanged((user) => {
    lastUser = user;
  });

  while (true) {
    if (lastUser !== ignoreValue) {
      // console.log('firebase user', lastUser);
      const user = lastUser && lastUser.providerData && lastUser.providerData[0];
      lastUser = ignoreValue;
      yield put(updateCurrentUser(user, sagaActionChunk));
    }

    yield call(delay, 100);
  }
}

export default function* () {
  return yield [
    yield takeLatest(LOGIN_REQUEST, login),
    yield takeLatest(LOGOUT, logout),
    yield fork(watchFirebaseCurrentUser),
  ];
}
