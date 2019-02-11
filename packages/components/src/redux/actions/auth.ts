import { User } from '@devhub/core'
import { createAction, createErrorAction } from '../helpers'
import { AuthError } from '../reducers/auth'

export function loginRequest(payload: { appToken: string }) {
  return createAction('LOGIN_REQUEST', payload)
}

export function loginSuccess(payload: { appToken: string; user: User }) {
  return createAction('LOGIN_SUCCESS', payload)
}

export function loginFailure<E extends AuthError>(error: E) {
  return createErrorAction('LOGIN_FAILURE', error)
}

export function logout() {
  return createAction('LOGOUT')
}
