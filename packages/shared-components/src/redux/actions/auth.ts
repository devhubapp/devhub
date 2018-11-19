import { GitHubUser } from 'shared-core/dist/types'
import {
  createAction,
  createErrorAction,
} from 'shared-core/dist/utils/helpers/redux'

export function loginRequest(payload: { token: string }) {
  return createAction('LOGIN_REQUEST', payload)
}

export function loginSuccess(user: GitHubUser) {
  return createAction('LOGIN_SUCCESS', user)
}

type HttpError = Error & { code: number } // TODO: Get this type from somewhere else
export function loginFailure<E extends HttpError>(error: E) {
  return createErrorAction('LOGIN_FAILURE', error)
}

export function logout() {
  return createAction('LOGOUT')
}
