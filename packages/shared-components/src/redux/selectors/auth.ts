import { RootState } from '../types'

const s = (state: RootState) => state.auth || {}

export const errorSelector = (state: RootState) => s(state).error

export const isLoggingInSelector = (state: RootState) => s(state).isLoggingIn

export const appTokenSelector = (state: RootState) => s(state).appToken

export const githubScopeSelector = (state: RootState) => s(state).githubScope

export const githubTokenSelector = (state: RootState) => s(state).githubToken

export const githubTokenTypeSelector = (state: RootState) =>
  s(state).githubTokenType

export const currentUserSelector = (state: RootState) =>
  appTokenSelector(state) && githubTokenSelector(state)
    ? s(state).user
    : undefined

export const currentUsernameSelector = (state: RootState) => {
  const user = currentUserSelector(state)
  return (user && user.github && user.github.login) || undefined
}
