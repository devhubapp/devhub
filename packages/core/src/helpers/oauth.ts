import { GitHubTokenDetails, OAuthResponseData } from '../types'

export function tryParseOAuthParams(
  params: OAuthResponseData,
): { appToken?: string; tokenDetails?: GitHubTokenDetails } {
  try {
    if (!(params && params.app_token && params.github_token))
      throw new Error('No token received.')

    const appToken = params.app_token
    const githubLogin = params.github_login
    const githubScope = params.github_scope
    const githubToken = params.github_token
    const githubTokenCreatedAt =
      params.github_token_created_at || new Date().toISOString()
    const githubTokenType = params.github_token_type || 'bearer'

    const tokenDetails: GitHubTokenDetails = {
      login: githubLogin,
      scope: githubScope,
      token: githubToken,
      tokenType: githubTokenType,
      tokenCreatedAt: githubTokenCreatedAt,
    }

    return { appToken, tokenDetails }
  } catch (error) {
    if (error.message === 'Canceled' || error.message === 'Timeout') return {}
    throw error
  }
}
