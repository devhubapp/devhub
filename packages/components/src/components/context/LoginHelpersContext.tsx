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
import { Platform } from '../../libs/platform'

export interface LoginHelpersProviderProps {
  children?: React.ReactNode
}

export interface LoginHelpersProviderState {
  addPersonalAccessToken: () => Promise<void>
  fullAccessRef: React.MutableRefObject<boolean>
  isExecutingOAuth: boolean
  isLoggingIn: boolean
  loginWithGitHub: (params?: {
    fullAccess?: boolean | undefined
  }) => Promise<void>
  loginWithGitHubPersonalAccessToken: () => Promise<void>
  patLoadingState: 'removing' | 'adding' | undefined
  removePersonalAccessToken: () => Promise<void>
}

export const LoginHelpersContext =
  React.createContext<LoginHelpersProviderState>({
    addPersonalAccessToken() {
      throw new Error('Not implemented')
    },
    fullAccessRef:
      React.createRef<boolean>() as React.MutableRefObject<boolean>,
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
  })
LoginHelpersContext.displayName = 'LoginHelpersContext'

function handleAuthError(
  error: unknown,
  description = 'Authentication failed',
  dialog: ReturnType<typeof useDialog>,
): void {
  console.error(description)
  if (error) console.error(error)

  const err =
    error instanceof Error
      ? error
      : new Error(typeof error === 'string' ? error : 'Unknown error')
  bugsnag.notify(err, { description })

  if (err.message === 'Canceled' || err.message === 'Timeout') return
  dialog.show('Login failed', err.message)
}

export function LoginHelpersProvider(props: LoginHelpersProviderProps) {
  const [isExecutingOAuth, setIsExecutingOAuth] = useState(false)
  const [patLoadingState, setPATLoadingState] = useState<
    'removing' | 'adding' | undefined
  >()

  const dispatch = useDispatch()
  const githubBaseApiUrl = useReduxState(selectors.githubBaseApiUrlSelector)
  const existingAppToken = useReduxState(selectors.appTokenSelector)
  const isLoggingIn = useReduxState(selectors.isLoggingInSelector)
  const loggedGitHubUserId = useReduxState(
    (state) => selectors.currentGitHubUserSelector(state)?.id,
  )
  const loggedGitHubUsername = useReduxState(
    selectors.currentGitHubUsernameSelector,
  )
  const error = useReduxState(selectors.authErrorSelector)
  const hasGitHubToken = useReduxState(
    (state) => !!selectors.githubTokenSelector(state),
  )

  const dialog = useDialog()

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
      handleAuthError(error, 'OAuth execution failed', dialog)
      setIsExecutingOAuth(false)
    }
  }

  const promptForPersonalAcessToken = useCallback(async (): Promise<
    string | undefined
  > => {
    let redirected = false
    const token = await new Promise<string | undefined>((resolveToken) => {
      dialog.show(
        'Personal Access Token',
        constants.LOCAL_ONLY_PERSONAL_ACCESS_TOKEN
          ? 'It will be stored safely on your local device and only be sent directly to GitHub.'
          : 'Enable private repository access.',
        [
          {
            text: 'Continue',
            onPress: (value: string) => resolveToken(value),
            style: 'default',
          },
          {
            text: 'Create new token',
            onPress: () => {
              const description = Platform.isMacOS
                ? 'DevHub (macOS native)'
                : Platform.isElectron
                ? `DevHub (${Platform.realOS})`
                : Platform.isDesktop
                ? `DevHub (${Platform.realOS})`
                : Platform.isPad
                ? 'DevHub (iPad)'
                : Platform.OS === 'ios'
                ? 'DevHub (iOS)'
                : `DevHub (${Platform.OS})`

              Browser.openURLOnNewTab(
                `https://github.com/settings/tokens/new?description=${encodeURIComponent(
                  description,
                )}&scopes=${(
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
          placeholder: 'Paste your Personal Access Token here',
          defaultValue: '',
        },
      )
    })

    if (redirected && !token) {
      return promptForPersonalAcessToken()
    }

    return token
  }, [dialog])

  const loginWithGitHubPersonalAccessToken = useCallback(async () => {
    try {
      analytics.trackEvent('engagement', 'login')

      const token = await promptForPersonalAcessToken()
      if (!token) throw new Error('Canceled')

      setIsExecutingOAuth(true)
      setPATLoadingState('adding')

      // Validate token with GitHub API
      const response = await axios.get(`${githubBaseApiUrl}/user`, {
        headers: {
          Authorization: `token ${token}`,
        },
      })

      if (!(response?.data?.id && response.data.login)) {
        throw new Error('Invalid response from GitHub API')
      }

      if (
        loggedGitHubUserId &&
        `${response.data.id}` !== `${loggedGitHubUserId}`
      ) {
        const details =
          response.data.login !== loggedGitHubUsername
            ? ` (${response.data.login} instead of ${loggedGitHubUsername})`
            : ` (ID ${response.data.id} instead of ${loggedGitHubUserId})`

        throw new Error(
          `This Personal Access Token seems to be from a different user${details}.`,
        )
      }

      const scope = `${response.headers['x-oauth-scopes'] || ''}`
        .replace(/\s+/g, '')
        .split(',')
        .filter(Boolean)

      if (scope.length && !scope.includes('repo')) {
        throw new Error(
          'You didn\'t include the "repo" permission scope,' +
            ' which is required to have access to private repositories.' +
            " Your token will be safe on your device, and will never be sent to DevHub's server.",
        )
      }

      // In local-only mode, store the token and use it directly
      if (constants.LOCAL_ONLY_PERSONAL_ACCESS_TOKEN) {
        dispatch(
          actions.replacePersonalTokenDetails({
            tokenDetails: {
              login: response.data.login,
              token,
              tokenCreatedAt: new Date().toISOString(),
              scope,
            },
          }),
        )

        // Use the personal access token as the app token
        dispatch(actions.loginRequest({ appToken: token }))
      } else {
        // In server mode, exchange the token for an app token
        const loginResponse = await axios.post(
          constants.GRAPHQL_ENDPOINT,
          {
            query: `
              mutation {
                loginWithPersonalAccessToken(input: { token: "${token}" }) {
                  appToken
                }
              }
            `,
          },
          {
            headers: getDefaultDevHubHeaders({ appToken: existingAppToken }),
          },
        )

        const { data, errors } = loginResponse.data

        if (errors && errors.length) {
          throw new Error(errors[0].message || 'GraphQL Error')
        }

        if (!data?.loginWithPersonalAccessToken?.appToken) {
          throw new Error('Invalid response')
        }

        dispatch(
          actions.loginRequest({
            appToken: data.loginWithPersonalAccessToken.appToken,
          }),
        )
      }

      setIsExecutingOAuth(false)
      setPATLoadingState(undefined)
    } catch (error) {
      handleAuthError(error, 'Personal access token login failed', dialog)
      setIsExecutingOAuth(false)
      setPATLoadingState(undefined)
    }
  }, [
    dialog,
    dispatch,
    githubBaseApiUrl,
    loggedGitHubUserId,
    loggedGitHubUsername,
    promptForPersonalAcessToken,
  ])

  const removePersonalAccessToken = useCallback(async () => {
    try {
      setPATLoadingState('removing')
      dispatch(actions.replacePersonalTokenDetails({ tokenDetails: undefined }))
      await Promise.resolve()
      setPATLoadingState(undefined)
    } catch (error) {
      handleAuthError(error, 'Failed to remove personal access token', dialog)
      setPATLoadingState(undefined)
    }
  }, [dialog, dispatch])

  const value = useMemo<LoginHelpersProviderState>(
    () => ({
      addPersonalAccessToken: loginWithGitHubPersonalAccessToken,
      fullAccessRef,
      isExecutingOAuth,
      isLoggingIn,
      loginWithGitHub,
      loginWithGitHubPersonalAccessToken,
      patLoadingState,
      removePersonalAccessToken,
    }),
    [
      loginWithGitHubPersonalAccessToken,
      isExecutingOAuth,
      isLoggingIn,
      loginWithGitHub,
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
