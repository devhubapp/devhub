import { EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'
import { githubAppTokenSelector, githubOAuthTokenSelector } from './github/auth'

const s = (state: RootState) => state.auth || EMPTY_OBJ

export const authErrorSelector = (state: RootState) => s(state).error

export const isDeletingAccountSelector = (state: RootState) =>
  s(state).isDeletingAccount

export const isLoggingInSelector = (state: RootState) => s(state).isLoggingIn

export const isLoggedSelector = (state: RootState) =>
  appTokenSelector(state) &&
  (githubAppTokenSelector(state) || githubOAuthTokenSelector(state))
    ? !!(s(state).user && s(state).user!._id)
    : false

export const appTokenSelector = (state: RootState) =>
  s(state).appToken || undefined

export const currentUserSelector = (state: RootState) =>
  isLoggedSelector(state) ? s(state).user : undefined

export const currentUserIdSelector = (state: RootState) => {
  const user = currentUserSelector(state)
  return (user && user._id) || undefined
}
