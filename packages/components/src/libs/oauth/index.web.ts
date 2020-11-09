import qs from 'qs'
import url from 'url'

import { constants, GitHubAppType, OAuthResponseData } from '@devhub/core'
import { Linking } from '../linking'
import { Platform } from '../platform/index.web'
import {
  getUrlParamsIfMatches,
  listenForNextMessageData,
  listenForNextUrl,
} from './helpers'

const schemaRedirectUri = Platform.isElectron
  ? constants.APP_DEEP_LINK_URLS.github_oauth
  : undefined

function getPopupTarget() {
  const currentURL = Linking.getCurrentURL()
  const query = qs.parse(url.parse(currentURL).query || '')

  return !__DEV__ &&
    (Platform.realOS === 'ios' ||
      Platform.realOS === 'android' ||
      query.installation_id ||
      Platform.isStandalone ||
      (navigator.userAgent || '').includes('Edge'))
    ? '_self'
    : '_blank'
}

function popupWindow(uri: string, w = 500, h = 600) {
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
    redirect_uri:
      schemaRedirectUri ||
      (Platform.OS === 'web' &&
        getPopupTarget() === '_self' &&
        window.location.origin) ||
      '',
    scope: scopeStr,
  })

  // console.log('[OAUTH] Opening popup...')
  const popup = popupWindow(
    `${constants.API_BASE_URL}/github/oauth?${querystring}`,
  )

  try {
    let params: OAuthResponseData | null

    if (schemaRedirectUri && (await Linking.canOpenURL(schemaRedirectUri))) {
      const uri = await listenForNextUrl()
      // console.log('[OAUTH] Received URL:', uri)

      params = getUrlParamsIfMatches(uri, schemaRedirectUri)
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
