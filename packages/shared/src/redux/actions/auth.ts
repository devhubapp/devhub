import { GitHubUser } from '../../types'
import {
  createActionCreator,
  createActionCreatorCreator,
  createErrorActionCreator,
} from '../../utils/helpers/redux'

export const loginRequest = createActionCreatorCreator('LOGIN_REQUEST')<{
  token: string
}>()

export const loginSuccess = createActionCreatorCreator('LOGIN_SUCCESS')<
  GitHubUser
>()

export const loginFailure = createErrorActionCreator('LOGIN_FAILURE')

export const logout = createActionCreator('LOGOUT')
