// @flow
/* eslint-disable import/prefer-default-export */

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../utils/constants/actions';

import { action, errorAction } from '../utils/helpers/actions';
import type { LoginRequestPayload, LoginResponsePayload,
} from '../utils/types';

export const loginRequest = (params: LoginRequestPayload, other?: Object) => (
  action(LOGIN_REQUEST, params, other)
);

export const loginSuccess = (request: LoginRequestPayload, data: Object, other?: Object) => (
  action(LOGIN_SUCCESS, ({ request, data }: LoginResponsePayload), other)
);

export const loginFailure = (request: LoginRequestPayload, error: any, other?: Object) => (
  errorAction(LOGIN_FAILURE, { request }, error, other)
);

export const logout = (other?: Object) => (
  action(LOGOUT, undefined, other)
);
