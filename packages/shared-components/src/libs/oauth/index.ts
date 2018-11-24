import qs from 'qs'

import { API_BASE_URL } from 'shared-core/dist/utils/constants'
import { Browser } from '../browser'
import { getUrlParamsIfMatches, listenForNextUrl } from './helpers'

const callbackURL = 'devhub://oauth/github'

export async function executeOAuth(scopes: string[]) {
  const scopesStr = (scopes || []).join(' ')
  const querystring = qs.stringify({
    scope: scopesStr,
    callback_url: callbackURL,
  })

  // console.log('[OAUTH] Opening browser...')
  Browser.openURL(`${API_BASE_URL}/oauth/github?${querystring}`)

  const url = await listenForNextUrl()
  // console.log('[OAUTH] Received URL:', url)

  const params = getUrlParamsIfMatches(url, callbackURL)
  // console.log('[OAUTH] URL params:', params)

  if (typeof Browser.dismiss === 'function') Browser.dismiss()

  if (!(params && params.access_token)) {
    throw new Error('Login failed: No access token received.')
  }

  return params
}
