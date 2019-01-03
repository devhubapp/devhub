import qs from 'qs'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Image, StyleSheet, View } from 'react-native'

import { GitHubLoginButton } from '../components/buttons/GitHubLoginButton'
import { AppVersion } from '../components/common/AppVersion'
import { Link } from '../components/common/Link'
import { Screen } from '../components/common/Screen'
import { Spacer } from '../components/common/Spacer'
import { useAnimatedTheme } from '../hooks/use-animated-theme'
import { analytics } from '../libs/analytics'
import { bugsnag } from '../libs/bugsnag'
import { executeOAuth } from '../libs/oauth'
import { getUrlParamsIfMatches, OAuthResponseData } from '../libs/oauth/helpers'
import { Platform } from '../libs/platform'
import * as actions from '../redux/actions'
import { useReduxAction } from '../redux/hooks/use-redux-action'
import { useReduxState } from '../redux/hooks/use-redux-state'
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

type LoginMethod = 'github.public' | 'github.private'

export const LoginScreen = React.memo(() => {
  const [loggingInMethod, setLoggingInMethod] = useState<LoginMethod | null>(
    null,
  )
  const [isExecutingOAuth, setIsExecutingOAuth] = useState(false)

  const isLoggingIn = useReduxState(selectors.isLoggingInSelector)
  const error = useReduxState(selectors.authErrorSelector)
  const initialErrorRef = useRef(error)
  const loginRequest = useReduxAction(actions.loginRequest)
  const theme = useAnimatedTheme()

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

      if (!loggingInMethod) {
        setLoggingInMethod(
          (githubScope || []).includes('repo')
            ? 'github.private'
            : 'github.public',
        )
      }

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

  const loginWithGitHub = async (method: LoginMethod) => {
    setLoggingInMethod(method)
    setIsExecutingOAuth(true)

    const githubScope =
      method === 'github.private'
        ? ['read:user', 'repo', 'notifications', 'read:org']
        : ['read:user', 'notifications', 'read:org']

    try {
      analytics.trackEvent('engagement', 'login', method, 1, { method })

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
            loading={
              (isLoggingIn || isExecutingOAuth) &&
              loggingInMethod === 'github.public'
            }
            onPress={() => loginWithGitHub('github.public')}
            // rightIcon="globe"
            style={styles.button}
            subtitle="Public access only"
            title="Sign in with GitHub"
          />

          {/* <GitHubLoginButton
            analyticsLabel="github_login_private"
            loading={
              (isLoggingIn || isExecutingOAuth) &&
              loggingInMethod === 'github.private'
            }
            onPress={() => loginWithGitHub('github.private')}
            // rightIcon="lock"
            style={styles.button}
            subtitle="Private access"
            title="Sign in with GitHub"
          /> */}

          <Spacer height={contentPadding} />

          <Link
            analyticsLabel="about-private-access"
            href="https://github.com/devhubapp/devhub/issues/32"
            openOnNewTab
          >
            <Animated.Text
              style={{ fontSize: 12, color: theme.foregroundColorMuted50 }}
            >
              What about private repositories?
            </Animated.Text>
          </Link>

          {/* <Spacer height={contentPadding} />

          <Link
            analyticsLabel="why-permission"
            href="https://github.com/dear-github/dear-github/issues/113"
            openOnNewTab
          >
            <Animated.Text
              style={{ fontSize: 12, color: theme.foregroundColorMuted50 }}
            >
              Why all these permissions?
            </Animated.Text>
          </Link> */}
        </View>

        <View style={styles.footer}>
          <Animated.Text
            style={[styles.title, { color: theme.foregroundColor }]}
          >
            DevHub
          </Animated.Text>
          <Animated.Text
            style={[styles.subtitle, { color: theme.foregroundColor }]}
          >
            TweetDeck for GitHub
          </Animated.Text>
          <AppVersion />
        </View>
      </View>
    </Screen>
  )
})
