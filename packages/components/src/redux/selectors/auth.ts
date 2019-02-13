import { RootState } from '../types'

const s = (state: RootState) => state.auth || {}

export const authErrorSelector = (state: RootState) => s(state).error

export const isLoggingInSelector = (state: RootState) => s(state).isLoggingIn

export const isLoggedSelector = (state: RootState) =>
  appTokenSelector(state) &&
  (githubAppTokenSelector(state) || githubOAuthTokenSelector(state))
    ? !!(s(state).user && s(state).user!._id)
    : false

export const appTokenSelector = (state: RootState) =>
  s(state).appToken || undefined

export const githubAppTokenDetailsSelector = (state: RootState) => {
  const user = s(state).user
  return (user && user.github.app) || undefined
}

export const githubAppScopeSelector = (state: RootState) => {
  const tokenDetails = githubAppTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.scope) || undefined
}

export const githubAppTokenSelector = (state: RootState) => {
  const tokenDetails = githubAppTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.token) || undefined
}

export const githubAppTokenTypeSelector = (state: RootState) => {
  const tokenDetails = githubAppTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.tokenType) || undefined
}

export const githubAppTokenCreatedAtSelector = (state: RootState) => {
  const tokenDetails = githubAppTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.tokenCreatedAt) || undefined
}

export const githubOAuthTokenDetailsSelector = (state: RootState) => {
  const user = s(state).user
  return (user && user.github.oauth) || undefined
}

export const githubOAuthScopeSelector = (state: RootState) => {
  const tokenDetails = githubOAuthTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.scope) || undefined
}

export const githubOAuthTokenSelector = (state: RootState) => {
  const tokenDetails = githubOAuthTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.token) || undefined
}

export const githubOAuthTokenTypeSelector = (state: RootState) => {
  const tokenDetails = githubOAuthTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.tokenType) || undefined
}

export const githubOAuthTokenCreatedAtSelector = (state: RootState) => {
  const tokenDetails = githubOAuthTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.tokenCreatedAt) || undefined
}

export const currentUserSelector = (state: RootState) =>
  isLoggedSelector(state) ? s(state).user : undefined

export const currentUsernameSelector = (state: RootState) => {
  const user = currentUserSelector(state)
  return (user && user.github && user.github.user.login) || undefined
}

export const currentUserIdSelector = (state: RootState) => {
  const user = currentUserSelector(state)
  return (user && user._id) || undefined
}
