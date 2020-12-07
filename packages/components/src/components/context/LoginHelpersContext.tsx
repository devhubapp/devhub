import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import axios from 'axios'
import _ from 'lodash'
import qs from 'qs'
import url from 'url'
import { useDispatch } from 'react-redux'
import { Alert } from 'react-native'

import { constants, tryParseOAuthParams } from '@devhub/core'

import { useDialog } from './DialogContext'
import { useReduxState } from '../../hooks/use-redux-state'
import { analytics } from '../../libs/analytics'
import { Browser } from '../../libs/browser'
import { bugsnag } from '../../libs/bugsnag'
import { Linking } from '../../libs/linking'
import { executeOAuth } from '../../libs/oauth'
import { getUrlParamsIfMatches } from '../../libs/oauth/helpers'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { getDefaultDevHubHeaders } from '../../utils/api'
import {
  clearOAuthQueryParams,
  clearQueryStringFromURL,
} from '../../utils/helpers/auth'

export interface LoginHelpersProviderProps {
  children?: React.ReactNode
}

export interface LoginHelpersProviderState {
  addPersonalAccessToken: () => Promise<void>
  fullAccessRef: React.MutableRefObject<boolean>
  isExecutingOAuth: boolean
  isLoggingIn: boolean
  loginWithGitHub: ({
    fullAccess,
  }?: {
    fullAccess?: boolean | undefined
  }) => Promise<void>
  loginWithGitHubPersonalAccessToken: () => Promise<void>
  patLoadingState: 'removing' | 'adding' | undefined
  removePersonalAccessToken: () => Promise<void>
}

export const LoginHelpersContext = React.createContext<LoginHelpersProviderState>(
  {
    addPersonalAccessToken() {
      throw new Error('Not implemented')
    },
    fullAccessRef: React.createRef<boolean>() as React.MutableRefObject<boolean>,
    isExecutingOAuth: false,
    isLoggingIn: false,
    loginWithGitHub() {
      throw new Error('Not implemented')
    },
    loginWithGitHubPersonalAccessToken() {
      throw new Error('Not implemented')
    },
    patLoadingState: undefined,
    removePersonalAccessToken() {
      throw new Error('Not implemented')
    },
  },
)
LoginHelpersContext.displayName = 'LoginHelpersContext'

export function LoginHelpersProvider(props: LoginHelpersProviderProps) {
  const [isExecutingOAuth, setIsExecutingOAuth] = useState(false)
  const [patLoadingState, setPATLoadingState] = useState<
    'removing' | 'adding' | undefined
  >()

  const dispatch = useDispatch()
  const existingAppToken = useReduxState(selectors.appTokenSelector)
  const isLoggingIn = useReduxState(selectors.isLoggingInSelector)
  const error = useReduxState(selectors.authErrorSelector)
  const hasGitHubToken = useReduxState(
    (state) => !!selectors.githubTokenSelector(state),
  )

  const Dialog = useDialog()

  const fullAccessRef = useRef(false)
  const initialErrorRef = useRef(error)

  async function loginWithGitHub({ fullAccess = false } = {}) {
    fullAccessRef.current = fullAccess

    setIsExecutingOAuth(true)

    try {
      analytics.trackEvent('engagement', 'login')

      const params = await executeOAuth('both', {
        scope: fullAccess
          ? [...constants.DEFAULT_GITHUB_OAUTH_SCOPES, 'repo']
          : constants.DEFAULT_GITHUB_OAUTH_SCOPES,
      })
      const { appToken } = tryParseOAuthParams(params)
      clearOAuthQueryParams()
      if (!appToken) throw new Error('No app token')

      dispatch(actions.loginRequest({ appToken }))
      setIsExecutingOAuth(false)
    } catch (error) {
      const description = 'OAuth execution failed'
      console.error(description, error)
      setIsExecutingOAuth(false)

      if (error.message === 'Canceled' || error.message === 'Timeout') return
      bugsnag.notify(error, { description })

      Dialog.show('Login failed', `${error || ''}`)
    }
  }

  const promptForPersonalAcessToken = useCallback(async (): Promise<
    string | undefined
  > => {
    let redirected = false
    const token = await new Promise<string | undefined>((resolveToken) => {
      Dialog.show(
        'Personal Access Token',
        'To have private access, you need to include the "repo" scope. Paste your GitHub token here:',
        [
          {
            text: 'Continue',
            onPress: (value: string) => resolveToken(value),
            style: 'default',
          },
          {
            text: 'Create new token',
            onPress: () => {
              Browser.openURLOnNewTab(
                `https://github.com/settings/tokens/new?description=DevHub&scopes=${(
                  constants.FULL_ACCESS_GITHUB_OAUTH_SCOPES ||
                  _.uniq([...constants.DEFAULT_GITHUB_OAUTH_SCOPES, 'repo'])
                ).join(',')}`,
              )

              redirected = true
              resolveToken(undefined)
            },
          },
          {
            text: 'Cancel',
            onPress: () => resolveToken(undefined),
            style: 'cancel',
          },
        ],
        {
          type: 'plain-text',
          cancelable: true,
          placeholder: 'Personal Access Token',
          defaultValue: '',
        },
      )
    })

    if (redirected && !token) {
      return promptForPersonalAcessToken()
    }

    return token
  }, [])

  const loginWithGitHubPersonalAccessToken = useCallback(async () => {
    try {
      analytics.trackEvent('engagement', 'login')

      const token = await promptForPersonalAcessToken()
      if (!token) throw new Error('Canceled')

      setIsExecutingOAuth(true)
      const response = await axios.post(
        `${constants.API_BASE_URL}/github/personal/login`,
        { token },
        { headers: getDefaultDevHubHeaders({ appToken: existingAppToken }) },
      )
      setIsExecutingOAuth(false)

      const appToken = response.data.appToken
      clearOAuthQueryParams()

      if (!appToken) throw new Error('No app token')

      dispatch(actions.loginRequest({ appToken }))
    } catch (error) {
      setIsExecutingOAuth(false)
      if (error.message === 'Canceled' || error.message === 'Timeout') return

      const description = 'OAuth execution failed'
      console.error(description, error)

      bugsnag.notify(error, { description })

      Dialog.show('Login failed', `${error || ''}`)
    }
  }, [existingAppToken])

  const addPersonalAccessToken = useCallback(async () => {
    setPATLoadingState('adding')
    await loginWithGitHubPersonalAccessToken()
    setPATLoadingState(undefined)
  }, [loginWithGitHubPersonalAccessToken])

  const removePersonalAccessToken = useCallback(async () => {
    try {
      setPATLoadingState('removing')

      const response = await axios.post(
        constants.GRAPHQL_ENDPOINT,
        {
          query: `
              mutation {
                removeGitHubPersonalToken
              }`,
        },
        { headers: getDefaultDevHubHeaders({ appToken: existingAppToken }) },
      )

      const { data, errors } = await response.data

      if (errors && errors[0] && errors[0].message)
        throw new Error(errors[0].message)

      if (!(data && data.removeGitHubPersonalToken)) {
        throw new Error('Not removed.')
      }

      setPATLoadingState(undefined)

      // dispatch(
      //   actions.replacePersonalTokenDetails({
      //     tokenDetails: undefined,
      //   }),
      // )

      // this is only necessary because we are not re-generating the appToken after removing the personal token,
      // which causes the personal token to being added back after a page refresh
      dispatch(actions.logout())
    } catch (error) {
      console.error(error)
      bugsnag.notify(error)

      setPATLoadingState(undefined)
      Alert.alert(`Failed to remove personal token. \nError: ${error.message}`)
    }
  }, [existingAppToken])

  // handle oauth flow without popup
  // that passes the token via query string
  useEffect(() => {
    const currentURL = Linking.getCurrentURL()
    const querystring = url.parse(currentURL).query || ''
    const query = qs.parse(querystring)

    if (!query.oauth) return

    const params = getUrlParamsIfMatches(querystring, '')
    if (!params) return

    try {
      const { appToken } = tryParseOAuthParams(params)
      clearOAuthQueryParams()
      if (!appToken) return

      dispatch(actions.loginRequest({ appToken }))
    } catch (error) {
      const description = 'OAuth execution failed'
      console.error(description, error)

      if (error.message === 'Canceled' || error.message === 'Timeout') return
      bugsnag.notify(error, { description })

      Dialog.show('Login failed', `${error || ''}`)
    }
  }, [])

  // auto start oauth flow after github app installation
  useEffect(() => {
    const handler = ({ url: uri }: { url: string }) => {
      const querystring = url.parse(uri).query || ''
      const query = qs.parse(querystring)

      if (query.oauth) return
      if (!query.installation_id) return

      void loginWithGitHub()

      setTimeout(() => {
        clearQueryStringFromURL(['installation_id', 'setup_action'])
      }, 500)
    }

    Linking.addEventListener('url', handler)

    handler({ url: Linking.getCurrentURL() })

    return () => {
      Linking.removeEventListener('url', handler)
    }
  }, [])

  useEffect(() => {
    if (!error || initialErrorRef.current === error) return

    const message = error && error.message
    Dialog.show(
      'Login failed',
      `Please try again. ${message ? ` \nError: ${message}` : ''}`,
    )
  }, [error])

  useEffect(() => {
    if (!hasGitHubToken && !!existingAppToken && !isLoggingIn) {
      dispatch(actions.logout())
    }
  }, [!hasGitHubToken && !!existingAppToken && !isLoggingIn])

  const value = useMemo(
    () => ({
      addPersonalAccessToken,
      fullAccessRef,
      isExecutingOAuth,
      isLoggingIn,
      loginWithGitHub,
      loginWithGitHubPersonalAccessToken,
      patLoadingState,
      removePersonalAccessToken,
    }),
    [
      addPersonalAccessToken,
      fullAccessRef,
      isExecutingOAuth,
      isLoggingIn,
      loginWithGitHub,
      loginWithGitHubPersonalAccessToken,
      patLoadingState,
      removePersonalAccessToken,
    ],
  )

  return (
    <LoginHelpersContext.Provider value={value}>
      {props.children}
    </LoginHelpersContext.Provider>
  )
}

export const LoginHelpersConsumer = LoginHelpersContext.Consumer

export function useLoginHelpers() {
  return useContext(LoginHelpersContext)
}
