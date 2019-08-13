import qs from 'qs'
import React, { useEffect, useRef, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import url from 'url'

import { constants, tryParseOAuthParams } from '@devhub/core'
import { getAppVersionLabel } from '../components/common/AppVersion'
import { FullHeightScrollView } from '../components/common/FullHeightScrollView'
import { GitHubLoginButton } from '../components/common/GitHubLoginButton'
import { Link } from '../components/common/Link'
import { Screen } from '../components/common/Screen'
import { Spacer } from '../components/common/Spacer'
import { ThemedText } from '../components/themed/ThemedText'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import { analytics } from '../libs/analytics'
import { bugsnag } from '../libs/bugsnag'
import { Linking } from '../libs/linking'
import { executeOAuth } from '../libs/oauth'
import { getUrlParamsIfMatches } from '../libs/oauth/helpers'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { sharedStyles } from '../styles/shared'
import { contentPadding } from '../styles/variables'
import {
  clearOAuthQueryParams,
  clearQueryStringFromURL,
} from '../utils/helpers/auth'

const logo = require('@devhub/components/assets/logo_circle.png') // tslint:disable-line

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 400,
    width: '100%',
  },

  contentContainer: {
    flex: 1,
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
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    alignSelf: 'center',
    height: 80,
    marginBottom: contentPadding / 2,
    width: 80,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 36,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 20,
    textAlign: 'center',
  },

  button: {
    alignSelf: 'stretch',
    marginTop: contentPadding / 2,
  },

  footerLink: {},

  footerLinkText: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },

  footerSeparatorText: {
    paddingHorizontal: contentPadding / 2,
    fontStyle: 'italic',
  },
})

export const LoginScreen = React.memo(() => {
  const [isExecutingOAuth, setIsExecutingOAuth] = useState(false)

  const isLoggingIn = useReduxState(selectors.isLoggingInSelector)
  const error = useReduxState(selectors.authErrorSelector)
  const initialErrorRef = useRef(error)
  const loginRequest = useReduxAction(actions.loginRequest)

  useEffect(() => {
    analytics.trackScreenView('LOGIN_SCREEN')
  })

  // handle oauth flow without popup
  // that passes the token via query string
  useEffect(() => {
    ;(async () => {
      const currentURL = await Linking.getCurrentURL()
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

        alert(`Login failed. ${error || ''}`)
      }
    })()
  }, [])

  // auto start oauth flow after github app installation
  useEffect(() => {
    const handler = ({ url: uri }: { url: string }) => {
      const querystring = url.parse(uri).query || ''
      const query = qs.parse(querystring)

      if (query.oauth) return
      if (!query.installation_id) return

      loginWithGitHub()

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
    alert(
      `Login failed. Please try again. ${
        message ? ` \nError: ${message}` : ''
      }`,
    )
  }, [error])

  const loginWithGitHub = async () => {
    setIsExecutingOAuth(true)

    try {
      analytics.trackEvent('engagement', 'login')

      const params = await executeOAuth('both', {
        scope: constants.DEFAULT_GITHUB_OAUTH_SCOPES,
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

      alert(`Login failed. ${error || ''}`)
    }
  }

  return (
    <Screen>
      <FullHeightScrollView
        alwaysBounceVertical={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header} />

        <View style={styles.mainContentContainer}>
          <Spacer height={contentPadding} />

          <Link
            analyticsCategory="loginscreen"
            analyticsLabel="logo"
            href="https://github.com/devhubapp/devhub"
            openOnNewTab
            style={styles.footerLink}
            textProps={{
              color: 'foregroundColorMuted40',
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

          <ThemedText color="foregroundColorMuted60" style={styles.subtitle}>
            GitHub Notifications Manager & Activity Watcher
          </ThemedText>

          <Spacer height={contentPadding} />

          <GitHubLoginButton
            analyticsLabel="github_login_public"
            loading={isLoggingIn || isExecutingOAuth}
            onPress={() => loginWithGitHub()}
            style={styles.button}
            title="Sign in with GitHub"
          />
        </View>

        <Spacer height={contentPadding} />

        <View style={styles.footer}>
          <View style={sharedStyles.horizontal}>
            <Link
              analyticsCategory="loginscreen"
              analyticsLabel="twitter"
              href="https://twitter.com/devhub_app"
              openOnNewTab
              style={styles.footerLink}
              textProps={{
                color: 'foregroundColorMuted40',
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
              href="https://github.com/devhubapp/devhub"
              openOnNewTab
              style={styles.footerLink}
              textProps={{
                color: 'foregroundColorMuted40',
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
              href="https://github.com/devhubapp/devhub/releases"
              openOnNewTab
              style={styles.footerLink}
              textProps={{
                color: 'foregroundColorMuted40',
                style: styles.footerLinkText,
              }}
            >
              {getAppVersionLabel()}
            </Link>
          </View>
        </View>
      </FullHeightScrollView>
    </Screen>
  )
})

LoginScreen.displayName = 'LoginScreen'
