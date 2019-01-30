import qs from 'qs'
import React, { useEffect, useRef, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'

import { SpringAnimatedText } from '../components/animated/spring/SpringAnimatedText'
import { GitHubLoginButton } from '../components/buttons/GitHubLoginButton'
import { AppVersion } from '../components/common/AppVersion'
import { Screen } from '../components/common/Screen'
import { Spacer } from '../components/common/Spacer'
import { useCSSVariablesOrSpringAnimatedTheme } from '../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import { analytics } from '../libs/analytics'
import { bugsnag } from '../libs/bugsnag'
import { executeOAuth } from '../libs/oauth'
import { getUrlParamsIfMatches, OAuthResponseData } from '../libs/oauth/helpers'
import { Platform } from '../libs/platform'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { contentPadding } from '../styles/variables'

const logo = require('@devhub/components/assets/logo_rounded.png') // tslint:disable-line

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

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  // handle oauth flow without popup
  // that passes the token via query string
  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== 'web') return
      const querystring = window.location.search
      if (!(querystring && querystring.includes('oauth=true'))) return

      const params = getUrlParamsIfMatches(querystring, '')
      if (!params) return
      handleOAuth(params)
    })()
  }, [])

  useEffect(
    () => {
      if (!error || initialErrorRef.current === error) return

      const message = error && error.message
      alert(
        `Login failed. Please try again. ${
          message ? ` \nError: ${message}` : ''
        }`,
      )
    },
    [error],
  )

  analytics.trackScreenView('LOGIN_SCREEN')

  const handleOAuth = async (
    params: OAuthResponseData,
    _githubScope?: string[],
  ) => {
    try {
      if (!(params && params.app_token && params.github_token))
        throw new Error('No token received.')

      const appToken = params.app_token
      const githubToken = params.github_token

      const githubTokenCreatedAt =
        params.github_token_created_at || new Date().toISOString()
      const githubTokenType = params.github_token_type || 'bearer'

      const githubScope =
        params.github_scope && params.github_scope.length
          ? params.github_scope
          : _githubScope

      await loginRequest({
        appToken,
        githubScope,
        githubToken,
        githubTokenType,
        githubTokenCreatedAt,
      })

      if (
        Platform.OS === 'web' &&
        !Platform.isElectron &&
        window.history &&
        window.history.replaceState
      ) {
        const newQuery = { ...params }
        delete newQuery.app_token
        delete newQuery.code
        delete newQuery.github_scope
        delete newQuery.github_token
        delete newQuery.github_token_created_at
        delete newQuery.github_token_type
        delete newQuery.oauth

        window.history.replaceState(
          {},
          document.title,
          `/${
            Object.keys(newQuery).length ? `?${qs.stringify(newQuery)}` : ''
          }`,
        )
      }
    } catch (error) {
      const description = 'OAuth failed'
      console.error(description, error)
      if (error.message === 'Canceled' || error.message === 'Timeout') return

      bugsnag.notify(error, { description })
      alert(`Login failed. ${error || ''}`)
    }
  }

  const loginWithGitHub = async () => {
    setIsExecutingOAuth(true)

    const githubScope = ['read:user', 'user:email', 'notifications', 'read:org']

    try {
      analytics.trackEvent('engagement', 'login')

      const params = await executeOAuth(githubScope)
      handleOAuth(params, githubScope)
    } catch (error) {
      const description = 'OAuth execution failed'
      console.error(description, error)
      setIsExecutingOAuth(false)

      if (error.message === 'Canceled' || error.message === 'Timeout') return
      bugsnag.notify(error, { description })
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
          <SpringAnimatedText
            style={[
              styles.title,
              { color: springAnimatedTheme.foregroundColor },
            ]}
          >
            DevHub
          </SpringAnimatedText>
          <SpringAnimatedText
            style={[
              styles.subtitle,
              { color: springAnimatedTheme.foregroundColor },
            ]}
          >
            TweetDeck for GitHub
          </SpringAnimatedText>
          <AppVersion />
        </View>
      </View>
    </Screen>
  )
})
