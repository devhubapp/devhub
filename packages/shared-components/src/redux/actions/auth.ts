import { User } from 'shared-core/dist/types/graphql'
import {
  createAction,
  createErrorAction,
} from 'shared-core/dist/utils/helpers/redux'

export function loginRequest(payload: { token: string }) {
  return createAction('LOGIN_REQUEST', payload)
}

export function loginSuccess(payload: { user: User }) {
  return createAction('LOGIN_SUCCESS', payload)
}

export function loginFailure(error: { code: number; message: string }) {
  return createErrorAction('LOGIN_FAILURE', error)
}

export function logout() {
  return createAction('LOGOUT')
}
