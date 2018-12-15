import qs from 'qs'

import { constants } from '@devhub/core'
import { Browser } from '../browser'
import { getUrlParamsIfMatches, listenForNextUrl } from './helpers'

const redirectUri = 'devhub://oauth/github'

export async function executeOAuth(scope: string[]) {
  const scopeStr = (scope || []).join(' ')
  const querystring = qs.stringify({
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
