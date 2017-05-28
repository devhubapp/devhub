// @flow

import moment from 'moment'
import * as firebase from 'firebase'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'

import { bugsnagClient } from '../utils/services'

import {
  FIREBASE_AUTH_STATE_CHANGED,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  RESET_ACCOUNT_DATA,
  UPDATE_CURRENT_USER,
} from '../utils/constants/actions'

import { get } from '../utils/immutable'

import oauth from './oauth'
import { sagaActionChunk } from './_shared'
import { loginSuccess, loginFailure, updateCurrentUser } from '../actions'
import { accessTokenSelector, userSelector } from '../selectors'
import type { Action, LoginRequestPayload } from '../utils/types'

function* onLoginRequest({ payload }: Action<LoginRequestPayload>) {
  const oauthURL = 'https://micro-oauth-pmkvlpfaua.now.sh'
  const { scopes } = payload

  try {
    const params = yield call(oauth, oauthURL, scopes)
    const result = { accessToken: params.access_token }
    yield put(loginSuccess(payload, result, sagaActionChunk))
  } catch (e) {
    console.error('Login failed', e)
    const errorMessage =
      e && ((e.message || {}).message || e.message || e.body || e.status)
    yield put(loginFailure(payload, errorMessage, sagaActionChunk))
  }
}

function* signInOnFirebase() {
  const accessToken = yield select(accessTokenSelector)

  if (!accessToken) {
    return
  }

  // sign in with firebase
  try {
    const credential = firebase.auth.GithubAuthProvider.credential(accessToken)
    yield firebase.auth().signInWithCredential(credential)
  } catch (e) {
    console.error(`Failed to login on Firebase: ${e.message}`, e)
  }
}

function* onLoginSuccess() {
  yield signInOnFirebase()
}

function* onLogoutRequest() {
  try {
    yield firebase.auth().signOut()
    if (bugsnagClient) bugsnagClient.clearUser()
  } catch (e) {
    console.error(`Failed to logout from Firebase: ${e.message}`, e)
  }
}

function* onCurrentUserUpdate() {
  if (!bugsnagClient) return

  const user = yield select(userSelector) || {}
  const id =
    get(user, 'firebaseId') || get(user, 'githubId') || get(user, 'uid')
  const name = get(user, 'name') || get(user, 'displayName')
  const email = get(user, 'email')

  bugsnagClient.setUser(id, name, email)
}

function* handleFirebaseAuthStateChanged({ user }) {
  // console.log('handleFirebaseAuthStateChanged', user)
  const githubData = (user || {}).providerData && user.providerData[0]

  const { uid: firebaseId } = user || {}

  const {
    uid: githubId,
    displayName: name,
    photoURL: avatarURL,
    ...restOfUser
  } = githubData || {}

  const payload = githubData && firebaseId
    ? {
        firebaseId,
        githubId,
        name,
        avatarURL,
        lastAccessedAt: moment().toISOString(),
        ...restOfUser,
      }
    : undefined

  yield put(updateCurrentUser(payload, sagaActionChunk))
}

export default function*() {
  return yield all([
    yield takeLatest(
      FIREBASE_AUTH_STATE_CHANGED,
      handleFirebaseAuthStateChanged,
    ),
    yield takeLatest(LOGIN_REQUEST, onLoginRequest),
    yield takeLatest(LOGIN_SUCCESS, onLoginSuccess),
    yield takeLatest(UPDATE_CURRENT_USER, onCurrentUserUpdate),
    yield takeLatest(
      [LOGIN_FAILURE, LOGOUT, RESET_ACCOUNT_DATA],
      onLogoutRequest,
    ),
  ])
}
