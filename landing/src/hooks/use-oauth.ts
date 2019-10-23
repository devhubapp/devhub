import { useCallback, useState } from 'react'

import {
  constants,
  GitHubAppType,
  tryParseOAuthParams,
} from '@brunolemos/devhub-core'
import { useAuth } from '../context/AuthContext'
import { getPlatform } from '../helpers'
import { useWindowEvent } from './use-window-event'

export function useOAuth() {
  const [popupWindow, setPopupWindow] = useState<Window | null>(null)
  const [isExecutingOAuth, setIsExecutingOAuth] = useState(false)

  const { login } = useAuth()

  function startOAuth(
    gitHubAppType: GitHubAppType | 'both',
    options: { appToken?: string; scope?: string[] | undefined } = {},
  ) {
    const { appToken, scope = constants.DEFAULT_GITHUB_OAUTH_SCOPES } = options

    const platform = getPlatform()

    const scopeStr = (scope || []).join(' ').trim()
    const querystring = Object.entries({
      app_token: appToken,
      github_app_type: gitHubAppType,
      is_electron: false,
      platform,
      redirect_uri: '',
      scope: scopeStr,
    })
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const popup = createPopupWindow(
      `${constants.API_BASE_URL}/github/oauth?${querystring}`,
    )

    setPopupWindow(popup)
    setIsExecutingOAuth(true)
  }

  useWindowEvent(
    'message',
    useCallback(
      (ev: MessageEvent) => {
        try {
          const params = tryParseOAuthParams(ev.data)
          if (!(params && params.appToken)) return

          login(params.appToken)
        } catch (error) {
          // noop
        }
      },
      [login],
    ),
  )

  useWindowEvent(
    'unload',
    useCallback(() => {
      setIsExecutingOAuth(false)
    }, []),
    popupWindow,
  )

  useWindowEvent(
    'close',
    useCallback(() => {
      setIsExecutingOAuth(false)
    }, []),
    popupWindow,
  )

  return { isExecutingOAuth, startOAuth }
}

function createPopupWindow(uri: string, w: number = 500, h: number = 600) {
  const left = (window.screen.width - w) / 2
  const top = (window.screen.height - h) / 2

  return window.open(
    uri,
    '_blank',
    `resizable=yes, width=${w}, height=${h}, top=${top}, left=${left}`,
  )
}
