import qs from 'qs'

import { constants, GitHubAppType } from '@devhub/core'
import { Browser } from '../browser'
import {
  getUrlParamsIfMatches,
  listenForNextUrl,
  OAuthResponseData,
} from './helpers'

const redirectUri = 'devhub://oauth/github'

export async function executeOAuth(
  gitHubAppType: GitHubAppType | 'both',
  options: { appToken?: string; scope?: string[] | undefined } = {},
): Promise<OAuthResponseData> {
  const { appToken, scope } = options

  const scopeStr = (scope || []).join(' ').trim()
  const querystring = qs.stringify({
    app_token: appToken,
    github_app_type: gitHubAppType,
    scope: scopeStr,
    redirect_uri: redirectUri,
  })

  // console.log('[OAUTH] Opening browser...')
  Browser.openURL(`${constants.API_BASE_URL}/oauth/github?${querystring}`)

  const url = await listenForNextUrl()
  // console.log('[OAUTH] Received URL:', url)

  const params = getUrlParamsIfMatches(url, redirectUri)
  // console.log('[OAUTH] URL params:', params)

  if (typeof Browser.dismiss === 'function') Browser.dismiss()

  if (!(params && params.app_token && params.github_token)) {
    throw new Error('Login failed: No access token received.')
  }

  return params
}
