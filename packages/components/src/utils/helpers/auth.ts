import qs from 'qs'

import { GitHubTokenDetails } from '@devhub/core'
import { OAuthResponseData } from '../../libs/oauth/helpers'
import { Platform } from '../../libs/platform'

export function clearQueryStringFromURL(fields: string[]) {
  if (
    !(
      Platform.OS === 'web' &&
      !Platform.isElectron &&
      window.history &&
      window.history.replaceState
    )
  )
    return

  const query = window.location.search.replace(new RegExp(`^[?]?`), '')
  const params = qs.parse(query)

  fields.forEach(field => {
    delete params[field]
  })

  window.history.replaceState(
    {},
    document.title,
    `${window.location.pathname || '/'}${
      Object.keys(params).length ? `?${qs.stringify(params)}` : ''
    }`,
  )
}

export function clearOAuthQueryParams() {
  clearQueryStringFromURL([
    'app_token',
    'code',
    'github_app_type',
    'github_scope',
    'github_token',
    'github_token_created_at',
    'github_token_type',
    'oauth',
  ])
}

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

    clearOAuthQueryParams()

    return { appToken, tokenDetails }
  } catch (error) {
    if (error.message === 'Canceled' || error.message === 'Timeout') return {}
    throw error
  }
}
