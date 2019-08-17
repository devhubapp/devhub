import { User } from '@devhub/core'
import { createAction, createErrorAction } from '../helpers'
import { AuthError, State as AuthState } from '../reducers/auth'

export function loginRequest(payload: { appToken: string }) {
  return createAction('LOGIN_REQUEST', payload)
}

export function loginSuccess(payload: {
  appToken: string
  user: NonNullable<User>
}) {
  return createAction('LOGIN_SUCCESS', payload)
}

export function loginFailure<E extends AuthError>(error: E) {
  return createErrorAction('LOGIN_FAILURE', error)
}

export function logout() {
  return createAction('LOGOUT')
}

export function updateUserData(
  payload: Partial<NonNullable<AuthState['user']>>,
) {
  return createAction('UPDATE_USER_DATA', payload)
}

export function deleteAccountRequest() {
  return createAction('DELETE_ACCOUNT_REQUEST')
}

export function deleteAccountSuccess() {
  return createAction('DELETE_ACCOUNT_SUCCESS')
}

export function deleteAccountFailure<E extends Error>(error: E) {
  return createErrorAction('DELETE_ACCOUNT_FAILURE', error)
}
