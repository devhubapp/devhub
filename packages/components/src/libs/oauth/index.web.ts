import qs from 'qs'
import url from 'url'

import { constants, GitHubAppType } from '@devhub/core'
import { Linking } from '../linking'
import { Platform } from '../platform/index.web'
import {
  getUrlParamsIfMatches,
  listenForNextMessageData,
  listenForNextUrl,
  OAuthResponseData,
} from './helpers'

const redirectUri = 'devhub://github/oauth'

function getPopupTarget() {
  const currentURL = Linking.getCurrentURL()
  const query = qs.parse(url.parse(currentURL).query || '')

  return !__DEV__ &&
    (Platform.realOS !== 'web' ||
      query.installation_id ||
      Platform.isStandalone ||
      (navigator.userAgent || '').includes('Edge'))
    ? '_self'
    : '_blank'
}

function popupWindow(uri: string, w: number = 500, h: number = 600) {
  const left = (window.screen.width - w) / 2
  const top = (window.screen.height - h) / 2

  return window.open(
    uri,
    getPopupTarget(),
    `resizable=yes, width=${w}, height=${h}, top=${top}, left=${left}`,
  )
}

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
    redirect_uri: Platform.isElectron ? redirectUri : '',
    scope: scopeStr,
  })

  // console.log('[OAUTH] Opening popup...')
  const popup = popupWindow(
    `${constants.API_BASE_URL}/github/oauth?${querystring}`,
  )

  try {
    let params: OAuthResponseData | null

    if (Platform.isElectron && (await Linking.canOpenURL(redirectUri))) {
      const uri = await listenForNextUrl()
      // console.log('[OAUTH] Received URL:', uri)

      params = getUrlParamsIfMatches(uri, redirectUri)
      // console.log('[OAUTH] URL params:', params)
    } else {
      params = await listenForNextMessageData(popup)
      // console.log('[OAUTH] Received data:', params)
    }

    if (!(params && params.app_token && params.github_token)) {
      throw new Error('Login failed: No access token received.')
    }

    return params
  } catch (e) {
    if (popup && popup !== window) popup.close()

    throw e
  }
}
