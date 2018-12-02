import { User } from 'shared-core/dist/types/graphql'
import {
  createAction,
  createErrorAction,
} from 'shared-core/dist/utils/helpers/redux'

export function loginRequest(payload: {
  appToken: string
  githubScope: string[] | undefined
  githubToken: string
  githubTokenType: 'bearer'
}) {
  return createAction('LOGIN_REQUEST', payload)
}

export function loginSuccess(payload: { appToken: string; user: User }) {
  return createAction('LOGIN_SUCCESS', payload)
}

export function loginFailure(error: any) {
  return createErrorAction('LOGIN_FAILURE', error)
}

export function logout() {
  return createAction('LOGOUT')
}
