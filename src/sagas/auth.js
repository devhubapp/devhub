// @flow

import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import OAuthManager from '../utils/oauth';

import {
  LOGIN_REQUEST,
} from '../utils/constants/actions';

import type { Action, LoginRequestPayload, LoginResponsePayload } from '../utils/types';

import {
  loginSuccess,
  loginFailure,
} from '../actions';

const sagaActionChunk = { dispatchedBySaga: true };

function* login({ payload }: Action<LoginRequestPayload>) {
  try {
    const { provider, ...params } = payload;

    const response = yield call(OAuthManager.authorize, provider, params);
    const { response: { credentials: { access_token } } }: LoginResponsePayload = response;

    const result = { access_token };
    yield put(loginSuccess(payload, result, sagaActionChunk));
  } catch (error) {
    console.log('login catch', error);
    const errorMessage = (error.message || {}).message || error.message || error.body || error.status;
    yield put(loginFailure(payload, errorMessage, sagaActionChunk));
  }
}

export default function* () {
  return yield [
    yield takeLatest(LOGIN_REQUEST, login),
  ];
}
