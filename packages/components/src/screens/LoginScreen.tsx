import React, { useEffect, useRef, useState } from 'react'
import { Animated, Image, StyleSheet, View } from 'react-native'

import { GitHubLoginButton } from '../components/buttons/GitHubLoginButton'
import { AppVersion } from '../components/common/AppVersion'
import { Screen } from '../components/common/Screen'
import { useAnimatedTheme } from '../hooks/use-animated-theme'
import { executeOAuth } from '../libs/oauth'
import * as actions from '../redux/actions'
import { useReduxAction } from '../redux/hooks/use-redux-action'
import { useReduxState } from '../redux/hooks/use-redux-state'
import * as selectors from '../redux/selectors'
import { contentPadding } from '../styles/variables'

const logo = require('@devhub/components/assets/logo.png') // tslint:disable-line

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
    borderRadius: 100 / 8,
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
  const [loggingInMethod, setLoggingInMethod] = useState<
    'github.public' | 'github.private' | null
  >(null)

  const isLoggingIn = useReduxState(selectors.isLoggingInSelector)
  const error = useReduxState(selectors.authErrorSelector)
  const initialErrorRef = useRef(error)
  const loginRequest = useReduxAction(actions.loginRequest)
  const theme = useAnimatedTheme()

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

  const loginWithGitHub = async (method: typeof loggingInMethod) => {
    setLoggingInMethod(method)

    const githubScope =
      method === 'github.private'
        ? ['user', 'repo', 'notifications', 'read:org']
        : ['user', 'public_repo', 'notifications', 'read:org']

    let appToken
    let githubToken
    let githubTokenCreatedAt
    let githubTokenType
    try {
      const params = await executeOAuth(githubScope)
      appToken = params && params.app_token
      githubToken = params && params.github_token
      githubTokenCreatedAt =
        (params && params.github_token_created_at) || new Date().toISOString()
      githubTokenType = (params && params.github_token_type) || 'bearer'

      if (!(appToken && githubToken)) throw new Error('No token received.')
    } catch (e) {
      console.error(e)
      if (e.message === 'Canceled' || e.message === 'Timeout') return
      alert(`Login failed. ${e || ''}`)
      return
    }

    await loginRequest({
      appToken,
      githubScope,
      githubToken,
      githubTokenType,
      githubTokenCreatedAt,
    })
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
            loading={isLoggingIn && loggingInMethod === 'github.public'}
            onPress={() => loginWithGitHub('github.public')}
            rightIcon="globe"
            style={styles.button}
            subtitle="Public access"
            title="Sign in with GitHub"
          />

          <GitHubLoginButton
            loading={isLoggingIn && loggingInMethod === 'github.private'}
            onPress={() => loginWithGitHub('github.private')}
            rightIcon="lock"
            style={styles.button}
            subtitle="Private access"
            title="Sign in with GitHub"
          />
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
