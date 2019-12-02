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

export const githubAppTokenTypeSelector = (state: RootState) => {
  const tokenDetails = githubAppTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.tokenType) || undefined
}

export const githubAppTokenCreatedAtSelector = (state: RootState) => {
  const tokenDetails = githubAppTokenDetailsSelector(state)
  return (tokenDetails && tokenDetails.tokenCreatedAt) || undefined
}

export const githubOAuthTokenDetailsSelector = (state: RootState) =>
  s(state).oauth

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

export const getPrivateTokenByOwnerSelector = (
  state: RootState,
  ownerName: string | undefined,
) => {
  const tokenDetails = githubOAuthTokenDetailsSelector(state)
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
