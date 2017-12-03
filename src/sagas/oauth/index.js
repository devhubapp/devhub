import qs from 'qs'

import Browser from '../../libs/browser'
import { getUrlParamsIfMatches, listenForNextUrl } from './helpers'
import { name as appName } from '../../../package.json'

const callbackURL = `${appName}://oauth/github`

export default async (serverURL, scopes = []) => {
  const scopesStr = (scopes || []).join(' ')
  const querystring = qs.stringify({
    scope: scopesStr,
    callback_url: callbackURL,
  })

  Browser.openURL(`${serverURL}/?${querystring}`)

  const url = await listenForNextUrl()
  const params = getUrlParamsIfMatches(url, callbackURL) || {}

  if (typeof Browser.dismiss === 'function') Browser.dismiss()

  if (!(params || {}).access_token) {
    throw new Error(
      'Login failed: No access token received.',
      'NoAccessTokenException',
    )
  }

  return params
}
