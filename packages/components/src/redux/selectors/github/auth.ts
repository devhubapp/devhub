import _ from 'lodash'

import { EMPTY_OBJ } from '../../../utils/constants'
import { RootState } from '../../types'
import { installationTokenByOwnerSelector } from './installations'

const s = (state: RootState) => (state.github && state.github.auth) || EMPTY_OBJ

export const githubAppTokenDetailsSelector = (state: RootState) => s(state).app

export const githubAppScopeSelector = (state: RootState) => {
  const tokenDetails = githubAppTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.scope) || undefined
}

export const githubAppTokenSelector = (state: RootState) => {
  const tokenDetails = githubAppTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.token) || undefined
}

export const githubOAuthTokenDetailsSelector = (state: RootState) =>
  s(state).oauth

export const githubPersonalTokenDetailsSelector = (state: RootState) =>
  s(state).personal

export const githubTokenDetailsSelector = (state: RootState) => {
  const githubPersonalTokenDetails = githubPersonalTokenDetailsSelector(state)
  if (githubPersonalTokenDetails && githubPersonalTokenDetails.token)
    return githubPersonalTokenDetails

  const githubOAuthTokenDetails = githubOAuthTokenDetailsSelector(state)
  return githubOAuthTokenDetails
}

export const githubOAuthScopeSelector = (state: RootState) => {
  const tokenDetails = githubTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.scope) || undefined
}

export const githubTokenSelector = (state: RootState) => {
  const tokenDetails = githubTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.token) || undefined
}

export const githubTokenTypeSelector = (state: RootState) => {
  const tokenDetails = githubTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.tokenType) || undefined
}

export const githubTokenCreatedAtSelector = (state: RootState) => {
  const tokenDetails = githubTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.tokenCreatedAt) || undefined
}

export const getPrivateTokenByOwnerSelector = (
  state: RootState,
  ownerName: string | undefined,
) => {
  const tokenDetails = githubTokenDetailsSelector(state)
  if (
    tokenDetails &&
    tokenDetails.token &&
    tokenDetails.scope &&
    tokenDetails.scope.includes('repo')
  )
    return tokenDetails.token

  const installationToken = installationTokenByOwnerSelector(state, ownerName)
  return installationToken || undefined
}

export const getPrivateTokenByRepoSelector = (
  state: RootState,
  ownerName: string | undefined,
  _repoName: string | undefined,
) => {
  return getPrivateTokenByOwnerSelector(state, ownerName)
}

export const currentGitHubUserSelector = (state: RootState) => {
  return s(state).user || undefined
}

export const currentGitHubUsernameSelector = (state: RootState) => {
  const user = s(state).user
  return (user && user.login) || undefined
}
