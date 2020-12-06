import { constants, tryParseOAuthParams } from '@devhub/core'
import axios from 'axios'
import _ from 'lodash'
import qs from 'qs'
import React, { useEffect, useRef, useState } from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import url from 'url'

import { getAppVersionLabel } from '../components/common/AppVersion'
import { FullHeightScrollView } from '../components/common/FullHeightScrollView'
import { GitHubLoginButton } from '../components/common/GitHubLoginButton'
import { Link } from '../components/common/Link'
import { Screen } from '../components/common/Screen'
import { Spacer } from '../components/common/Spacer'
import { useDialog } from '../components/context/DialogContext'
import { ThemedText } from '../components/themed/ThemedText'
import { useDimensions } from '../hooks/use-dimensions'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import { analytics } from '../libs/analytics'
import { Browser } from '../libs/browser'
import { bugsnag } from '../libs/bugsnag'
import { Linking } from '../libs/linking'
import { executeOAuth } from '../libs/oauth'
import { getUrlParamsIfMatches } from '../libs/oauth/helpers'
import { Platform } from '../libs/platform'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { sharedStyles } from '../styles/shared'
import {
  contentPadding,
  normalTextSize,
  scaleFactor,
  smallerTextSize,
} from '../styles/variables'
import { getDefaultDevHubHeaders } from '../utils/api'
import {
  clearOAuthQueryParams,
  clearQueryStringFromURL,
} from '../utils/helpers/auth'

const logo = require('@devhub/components/assets/logo_circle.png').default // eslint-disable-line

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
  },

  contentContainer: {
    alignItems: 'stretch',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: contentPadding,
  },

  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    height: normalTextSize * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    alignSelf: 'center',
    height: 80 * scaleFactor,
    marginBottom: contentPadding / 2,
    width: 80 * scaleFactor,
  },

  title: {
    fontSize: 30 * scaleFactor,
    fontWeight: 'bold',
    lineHeight: 36 * scaleFactor,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: normalTextSize + 2 * scaleFactor,
    fontWeight: '400',
    lineHeight: normalTextSize + 4 * scaleFactor,
    textAlign: 'center',
  },

  button: {
    alignSelf: 'stretch',
    marginTop: contentPadding / 2,
  },

  footerLink: {},

  footerLinkText: {
    fontSize: normalTextSize,
    lineHeight: normalTextSize * 1.5,
    textAlign: 'center',
  },

  footerSeparatorText: {
    paddingHorizontal: contentPadding / 2,
    fontStyle: 'italic',
  },
})

export const LoginScreen = React.memo(() => {
  const fullAccessRef = useRef(false)
  const [isExecutingOAuth, setIsExecutingOAuth] = useState(false)

  const Dialog = useDialog()
  const isLoggingIn = useReduxState(selectors.isLoggingInSelector)
  const error = useReduxState(selectors.authErrorSelector)
  const initialErrorRef = useRef(error)
  const loginRequest = useReduxAction(actions.loginRequest)
  const dimensions = useDimensions('width')

  useEffect(() => {
    analytics.trackScreenView('LOGIN_SCREEN')
  })

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

      loginRequest({ appToken })
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

  async function loginWithGitHub() {
    setIsExecutingOAuth(true)

    try {
      analytics.trackEvent('engagement', 'login')

      const params = await executeOAuth('both', {
        scope: fullAccessRef.current
          ? [...constants.DEFAULT_GITHUB_OAUTH_SCOPES, 'repo']
          : constants.DEFAULT_GITHUB_OAUTH_SCOPES,
      })
      const { appToken } = tryParseOAuthParams(params)
      clearOAuthQueryParams()
      if (!appToken) throw new Error('No app token')

      loginRequest({ appToken })
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

  async function loginWithGitHubPersonalAccessToken() {
    try {
      analytics.trackEvent('engagement', 'login')

      let redirected = false
      const token = await new Promise((resolveToken) => {
        Dialog.show(
          'Personal Access Token',
          'Paste your GitHub token here:',
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
        void loginWithGitHubPersonalAccessToken()
        return
      }

      if (!token) throw new Error('Canceled')

      setIsExecutingOAuth(true)

      const response = await axios.post(
        `${constants.API_BASE_URL}/github/personal/login`,
        { token },
        { headers: getDefaultDevHubHeaders({ appToken: undefined }) },
      )

      const appToken = response.data.appToken
      clearOAuthQueryParams()

      if (!appToken) throw new Error('No app token')

      loginRequest({ appToken })
      setIsExecutingOAuth(false)
    } catch (error) {
      setIsExecutingOAuth(false)
      if (error.message === 'Canceled' || error.message === 'Timeout') return

      const description = 'OAuth execution failed'
      console.error(description, error)

      bugsnag.notify(error, { description })

      Dialog.show('Login failed', `${error || ''}`)
    }
  }

  return (
    <Screen>
      <FullHeightScrollView
        alwaysBounceVertical={false}
        style={[
          styles.container,
          { maxWidth: Math.min(400 * scaleFactor, dimensions.width) },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header} />

        <View style={styles.mainContentContainer}>
          <Spacer height={contentPadding} />

          <Link
            analyticsCategory="loginscreen"
            analyticsLabel="logo"
            href={constants.DEVHUB_LINKS.GITHUB_REPOSITORY}
            openOnNewTab
            style={styles.footerLink}
            textProps={{
              color: 'foregroundColorMuted65',
              style: styles.footerLinkText,
            }}
          >
            <Image resizeMode="contain" source={logo} style={styles.logo} />
          </Link>

          <Spacer height={contentPadding} />

          <ThemedText color="foregroundColor" style={styles.title}>
            Welcome to DevHub
          </ThemedText>

          <Spacer height={contentPadding / 2} />

          <ThemedText color="foregroundColorMuted65" style={styles.subtitle}>
            GitHub Notifications & Activities on your Desktop
          </ThemedText>

          <Spacer height={contentPadding * 2} />

          {!Platform.isMacOS && (
            <GitHubLoginButton
              analyticsLabel="github_login_public"
              disabled={isLoggingIn || isExecutingOAuth}
              loading={
                !fullAccessRef.current && (isLoggingIn || isExecutingOAuth)
              }
              onPress={() => {
                fullAccessRef.current = false
                void loginWithGitHub()
              }}
              // rightIcon={{ family: 'octicon', name: 'globe' }}
              style={styles.button}
              subtitle={
                constants.SHOW_GITHUB_FULL_ACCESS_LOGIN_BUTTON ||
                constants.SHOW_GITHUB_PERSONAL_TOKEN_LOGIN_BUTTON ||
                !constants.GITHUB_APP_HAS_CODE_ACCESS
                  ? 'Granular permissions'
                  : undefined
              }
              title="Sign in with GitHub"
            />
          )}

          {!!constants.SHOW_GITHUB_FULL_ACCESS_LOGIN_BUTTON && (
            <>
              <Spacer height={contentPadding / 2} />

              <GitHubLoginButton
                analyticsLabel="github_login_private"
                disabled={isLoggingIn || isExecutingOAuth}
                loading={
                  fullAccessRef.current && (isLoggingIn || isExecutingOAuth)
                }
                onPress={() => {
                  fullAccessRef.current = true
                  void loginWithGitHub()
                }}
                // rightIcon={{ family: 'octicon', name: 'lock' }}
                style={styles.button}
                subtitle="Full access"
                title="Sign in with GitHub"
                type="neutral"
              />
            </>
          )}

          {!!constants.SHOW_GITHUB_PERSONAL_TOKEN_LOGIN_BUTTON && (
            <>
              <Spacer height={contentPadding / 2} />

              <GitHubLoginButton
                analyticsLabel="github_login_personal"
                disabled={isLoggingIn || isExecutingOAuth}
                loading={
                  fullAccessRef.current && (isLoggingIn || isExecutingOAuth)
                }
                onPress={() => {
                  fullAccessRef.current = true
                  void loginWithGitHubPersonalAccessToken()
                }}
                // rightIcon={{ family: 'octicon', name: 'key' }}
                style={styles.button}
                subtitle="Personal token"
                title="Sign in with GitHub"
                type={Platform.isMacOS ? 'primary' : 'neutral'}
              />
            </>
          )}

          {!Platform.isMacOS &&
            !!(
              constants.SHOW_GITHUB_FULL_ACCESS_LOGIN_BUTTON ||
              constants.SHOW_GITHUB_PERSONAL_TOKEN_LOGIN_BUTTON
            ) && (
              <>
                <Spacer height={contentPadding} />

                <ThemedText
                  color="foregroundColorMuted65"
                  style={[
                    sharedStyles.textCenter,
                    { fontSize: smallerTextSize, fontStyle: 'italic' },
                  ]}
                >
                  {`"Granular permissions" is recommended, but feel free to use the ${[
                    constants.SHOW_GITHUB_FULL_ACCESS_LOGIN_BUTTON &&
                      '"Full access"',
                    constants.SHOW_GITHUB_PERSONAL_TOKEN_LOGIN_BUTTON &&
                      '"Personal token"',
                  ]
                    .filter(Boolean)
                    .join(
                      ' or ',
                    )} option to easily get access to all private repositories you have access.`}
                </ThemedText>
              </>
            )}
        </View>

        <Spacer height={contentPadding} />

        <View style={styles.footer}>
          <ScrollView horizontal>
            <Link
              analyticsCategory="loginscreen"
              analyticsLabel="twitter"
              href={constants.DEVHUB_LINKS.TWITTER_PROFILE}
              openOnNewTab
              style={styles.footerLink}
              textProps={{
                color: 'foregroundColorMuted65',
                style: styles.footerLinkText,
              }}
            >
              Twitter
            </Link>

            <ThemedText
              color="foregroundColorMuted25"
              style={styles.footerSeparatorText}
            >
              |
            </ThemedText>

            <Link
              analyticsCategory="loginscreen"
              analyticsLabel="github"
              href={constants.DEVHUB_LINKS.GITHUB_REPOSITORY}
              openOnNewTab
              style={styles.footerLink}
              textProps={{
                color: 'foregroundColorMuted65',
                style: styles.footerLinkText,
              }}
            >
              GitHub
            </Link>

            <ThemedText
              color="foregroundColorMuted25"
              style={styles.footerSeparatorText}
            >
              |
            </ThemedText>

            <Link
              analyticsCategory="loginscreen"
              analyticsLabel="app_version"
              href={`${constants.DEVHUB_LINKS.GITHUB_REPOSITORY}/releases`}
              openOnNewTab
              style={styles.footerLink}
              textProps={{
                color: 'foregroundColorMuted65',
                style: styles.footerLinkText,
              }}
            >
              {getAppVersionLabel()}
            </Link>
          </ScrollView>
        </View>
      </FullHeightScrollView>
    </Screen>
  )
})

LoginScreen.displayName = 'LoginScreen'
