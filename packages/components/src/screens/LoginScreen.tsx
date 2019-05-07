import qs from 'qs'
import React, { useEffect, useRef, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import url from 'url'

import { constants } from '@devhub/core'
import { GitHubLoginButton } from '../components/buttons/GitHubLoginButton'
import { AppVersion } from '../components/common/AppVersion'
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
import { contentPadding } from '../styles/variables'
import {
  clearQueryStringFromURL,
  tryParseOAuthParams,
} from '../utils/helpers/auth'

const logo = require('@devhub/components/assets/logo_circle.png') // tslint:disable-line

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    padding: contentPadding,
    width: '100%',
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
    marginTop: contentPadding,
  },

  logo: {
    alignSelf: 'center',
    height: 100,
    marginBottom: contentPadding / 2,
    width: 100,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 26,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 18,
  },

  button: {
    alignSelf: 'stretch',
    marginTop: contentPadding / 2,
  },

  appVersion: {
    fontSize: 14,
    lineHeight: 18,
  },
})

export const LoginScreen = React.memo(() => {
  const [isExecutingOAuth, setIsExecutingOAuth] = useState(false)

  const isLoggingIn = useReduxState(selectors.isLoggingInSelector)
  const error = useReduxState(selectors.authErrorSelector)
  const initialErrorRef = useRef(error)
  const loginRequest = useReduxAction(actions.loginRequest)

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

  analytics.trackScreenView('LOGIN_SCREEN')

  const loginWithGitHub = async () => {
    setIsExecutingOAuth(true)

    try {
      analytics.trackEvent('engagement', 'login')

      const params = await executeOAuth('both', {
        scope: constants.DEFAULT_GITHUB_OAUTH_SCOPES,
      })
      const { appToken } = tryParseOAuthParams(params)
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
      <View style={styles.container}>
        <View style={styles.header} />

        <View style={styles.mainContentContainer}>
          <Image
            resizeMode="contain"
            source={logo}
            style={styles.logo as any}
          />

          <Spacer height={contentPadding / 2} />

          <GitHubLoginButton
            analyticsLabel="github_login_public"
            loading={isLoggingIn || isExecutingOAuth}
            onPress={() => loginWithGitHub()}
            style={styles.button}
            title="Sign in with GitHub"
          />

          <Spacer height={contentPadding} />
        </View>

        <View style={styles.footer}>
          <ThemedText color="foregroundColor" style={styles.title}>
            DevHub
          </ThemedText>
          <ThemedText color="foregroundColor" style={styles.subtitle}>
            TweetDeck for GitHub
          </ThemedText>
          <AppVersion />
        </View>
      </View>
    </Screen>
  )
})

export default LoginScreen
