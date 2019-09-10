import qs from 'qs'

import { constants, GitHubAppType, OAuthResponseData } from '@devhub/core'
import { Browser } from '../browser'
import { Platform } from '../platform'
import { getUrlParamsIfMatches, listenForNextUrl } from './helpers'

const redirectUri = constants.APP_DEEP_LINK_URLS.github_oauth

export async function executeOAuth(
  gitHubAppType: GitHubAppType | 'both',
  options: { appToken?: string; scope?: string[] | undefined } = {},
): Promise<OAuthResponseData> {
  const { appToken, scope } = options

  const scopeStr = (scope || []).join(' ').trim()
  const querystring = qs.stringify({
    app_token: appToken,
    github_app_type: gitHubAppType,
    is_electron: Platform.isElectron,
    platform: Platform.OS,
    redirect_uri: redirectUri,
    scope: scopeStr,
  })

  // console.log('[OAUTH] Opening browser...')
  Browser.openURL(`${constants.API_BASE_URL}/github/oauth?${querystring}`)

  const url = await listenForNextUrl()
  // console.log('[OAUTH] Received URL:', url)

  const params = getUrlParamsIfMatches(url, redirectUri)
  // console.log('[OAUTH] URL params:', params)

  if (!(params && params.app_token && params.github_token)) {
    throw new Error('Login failed: No access token received.')
  }

  return params
}
