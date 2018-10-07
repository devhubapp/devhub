import qs from 'qs'

import Browser from '../browser'
import { getUrlParamsIfMatches, listenForNextUrl } from './helpers'

const pkg = require('../../../package.json') // tslint:disable-line

const callbackURL = `${pkg.name}://oauth/github`

export async function executeOAuth(serverURL: string, scopes: string[]) {
  const scopesStr = (scopes || []).join(' ')
  const querystring = qs.stringify({
    scope: scopesStr,
    callback_url: callbackURL,
  })

  // console.log('[OAUTH] Opening browser...')
  Browser.openURL(`${serverURL}/?${querystring}`)

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
