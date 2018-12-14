import { RootState } from '../types'

const s = (state: RootState) => state.auth || {}

export const authErrorSelector = (state: RootState) => s(state).error

export const isLoggingInSelector = (state: RootState) => s(state).isLoggingIn

export const appTokenSelector = (state: RootState) => s(state).appToken

export const githubScopeSelector = (state: RootState) =>
  s(state).user && s(state).user!.github.scope

export const githubHasPrivateAccessSelector = (state: RootState) =>
  !!githubScopeSelector(state) && githubScopeSelector(state)!.includes('repo')

export const githubTokenSelector = (state: RootState) =>
  s(state).user && s(state).user!.github.token

export const githubTokenTypeSelector = (state: RootState) =>
  s(state).user && s(state).user!.github.tokenType

export const githubTokenCreatedAtSelector = (state: RootState) =>
  s(state).user && s(state).user!.github.tokenCreatedAt

export const currentUserSelector = (state: RootState) =>
  appTokenSelector(state) && githubTokenSelector(state)
    ? s(state).user
    : undefined

export const currentUsernameSelector = (state: RootState) => {
  const user = currentUserSelector(state)
  return (user && user.github && user.github.user.login) || undefined
}

export const currentUserIdSelector = (state: RootState) => {
  const user = currentUserSelector(state)
  return (user && user._id) || undefined
}
