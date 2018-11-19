import { REHYDRATE } from 'redux-persist'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'

import {
  ExtractActionFromActionCreator,
  GitHubUser,
} from 'shared-core/dist/types'
import * as github from '../../libs/github'
import * as actions from '../actions'
import * as selectors from '../selectors'

function* onRehydrate() {
  const token = yield select(selectors.tokenSelector)
  if (token) yield put(actions.loginRequest({ token }))
}

function* onLoginRequest(
  action: ExtractActionFromActionCreator<typeof actions.loginRequest>,
) {
  try {
    github.authenticate(action.payload.token || '')

    const response = yield call(github.octokit.users.get, {})
    const user = response.data as GitHubUser
    if (!(user && user.id && user.login)) throw new Error('Invalid response')

    yield put(actions.loginSuccess(user))
  } catch (e) {
    yield put(actions.loginFailure(e))
  }
}

function* onLoginFailure(
  action: ExtractActionFromActionCreator<typeof actions.loginFailure>,
) {
  if (action.error.code === 401) yield put(actions.logout())
}

function onLogout() {
  github.authenticate('')
}

export function* authSagas() {
  yield all([
    yield takeLatest(REHYDRATE, onRehydrate),
    yield takeLatest('LOGIN_FAILURE', onLoginFailure),
    yield takeLatest('LOGIN_REQUEST', onLoginRequest),
    yield takeLatest('LOGOUT', onLogout),
  ])
}
