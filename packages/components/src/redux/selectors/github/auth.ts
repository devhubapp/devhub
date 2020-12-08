import { constants } from '@devhub/core'

import { EMPTY_OBJ } from '../../../utils/constants'
import { RootState } from '../../types'
import { installationTokenByOwnerSelector } from './installations'

const s = (state: RootState) => (state.github && state.github.auth) || EMPTY_OBJ

export const githubAppTokenDetailsSelector = (state: RootState) =>
  (constants.ENABLE_GITHUB_APP_SUPPORT && s(state).app) || undefined

export const githubAppTokenSelector = (state: RootState) => {
  const tokenDetails = githubAppTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.token) || undefined
}

export const githubOAuthTokenDetailsSelector = (state: RootState) =>
  (constants.ENABLE_GITHUB_OAUTH_SUPPORT && s(state).oauth) || undefined

export const githubPersonalTokenDetailsSelector = (state: RootState) =>
  (constants.ENABLE_GITHUB_PERSONAL_ACCESS_TOKEN_SUPPORT &&
    s(state).personal) ||
  undefined

export const githubTokenDetailsSelector = (state: RootState) => {
  const githubPersonalTokenDetails = githubPersonalTokenDetailsSelector(state)
  if (githubPersonalTokenDetails?.token) return githubPersonalTokenDetails

  const githubOAuthTokenDetails = githubOAuthTokenDetailsSelector(state)
  if (githubOAuthTokenDetails?.token) return githubOAuthTokenDetails

  return undefined
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

export const githubPrivateTokenDetailsSelector = (state: RootState) => {
  const githubPersonalTokenDetails = githubPersonalTokenDetailsSelector(state)
  if (
    githubPersonalTokenDetails?.token &&
    githubPersonalTokenDetails.scope?.includes('repo')
  )
    return githubPersonalTokenDetails

  const githubOAuthTokenDetails = githubOAuthTokenDetailsSelector(state)
  if (
    githubOAuthTokenDetails?.token &&
    githubOAuthTokenDetails.scope?.includes('repo')
  )
    return githubOAuthTokenDetails

  return undefined
}

export const getPrivateTokenByOwnerSelector = (
  state: RootState,
  ownerName: string | undefined,
) => {
  const privateTokenDetails = githubPrivateTokenDetailsSelector(state)
  if (privateTokenDetails?.token) return privateTokenDetails.token

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
