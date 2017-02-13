// @flow

import * as firebase from 'firebase';
import { delay } from 'redux-saga';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';

import OAuthManager from '../utils/oauth';

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../utils/constants/actions';

import type { Action, LoginRequestPayload } from '../utils/types';

import {
  loginSuccess,
  loginFailure,
  updateCurrentUser,
} from '../actions';

import { accessTokenSelector } from '../selectors';

const sagaActionChunk = { dispatchedBySaga: true };

function* onLoginRequest({ payload }: Action<LoginRequestPayload>) {
  try {
    const { provider, ...params } = payload;

    // TODO: Remove this after reimplement oauth
    const accessToken = '5957acfcb0d4fd12e03a6449360b8a37676942d9';

    // const response = yield call(OAuthManager.authorize, provider, params);
    // const { response: { credentials: { accessToken } = {} } = {} } = response || {};
    // console.log('response', response);

    if (!accessToken) {
      throw new Error('Login failed: No access token received.', 'NoAccessTokenException');
    }

    const result = { accessToken };
    yield put(loginSuccess(payload, result, sagaActionChunk));
  } catch (e) {
    console.log('Login failed', e);
    const errorMessage = (e.message || {}).message || e.message || e.body || e.status;
    yield put(loginFailure(payload, errorMessage, sagaActionChunk));
  }
}

function* signInOnFirebase() {
  const state = yield select();
  const accessToken = accessTokenSelector(state);

  if (!accessToken) {
    return;
  }

  // sign in with firebase
  try {
    const credential = firebase.auth.GithubAuthProvider.credential(accessToken);
    yield firebase.auth().signInWithCredential(credential);
  } catch (e) {
    console.error(`Failed to login on Firebase: ${e.message}`, e);
  }
}

function* onLoginSuccessOrRestored() {
  yield signInOnFirebase();
}

function* onLogoutRequest() {
  try {
    yield firebase.auth().signOut();
  } catch (e) {
    console.error(`Failed to logout from Firebase: ${e.message}`, e);
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

      const payload = user ? { ...user, lastAccessedAt: new Date() } : undefined;
      yield put(updateCurrentUser(payload, sagaActionChunk));
    }

    yield call(delay, 100);
  }
}

export default function* () {
  return yield [
    yield takeLatest(LOGIN_REQUEST, onLoginRequest),
    // yield takeLatest([LOGIN_SUCCESS, REHYDRATE], onLoginSuccessOrRestored),
    yield takeLatest([LOGIN_FAILURE, LOGOUT], onLogoutRequest),
    // yield fork(watchFirebaseCurrentUser),
  ];
}
