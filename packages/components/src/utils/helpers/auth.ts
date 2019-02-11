import qs from 'qs'

import { GitHubTokenDetails } from '@devhub/core'
import { OAuthResponseData } from '../../libs/oauth/helpers'
import { Platform } from '../../libs/platform'

export function tryParseOAuthParams(
  params: OAuthResponseData,
): { appToken?: string; tokenDetails?: GitHubTokenDetails } {
  try {
    if (!(params && params.app_token && params.github_token))
      throw new Error('No token received.')

    const appToken = params.app_token
    const githubScope = params.github_scope
    const githubToken = params.github_token
    const githubTokenCreatedAt =
      params.github_token_created_at || new Date().toISOString()
    const githubTokenType = params.github_token_type || 'bearer'

    const tokenDetails: GitHubTokenDetails = {
      scope: githubScope,
      token: githubToken,
      tokenType: githubTokenType,
      tokenCreatedAt: githubTokenCreatedAt,
    }

    if (
      Platform.OS === 'web' &&
      !Platform.isElectron &&
      window.history &&
      window.history.replaceState
    ) {
      const newQuery = { ...params }
      delete newQuery.app_token
      delete newQuery.code
      delete newQuery.github_app_type
      delete newQuery.github_scope
      delete newQuery.github_token
      delete newQuery.github_token_created_at
      delete newQuery.github_token_type
      delete newQuery.oauth

      window.history.replaceState(
        {},
        document.title,
        `${window.location.pathname || '/'}${
          Object.keys(newQuery).length ? `?${qs.stringify(newQuery)}` : ''
        }`,
      )
    }

    return { appToken, tokenDetails }
  } catch (error) {
    if (error.message === 'Canceled' || error.message === 'Timeout') return {}
    throw error
  }
}
