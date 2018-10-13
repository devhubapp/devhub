import React, { PureComponent } from 'react'
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import GitHubLoginButton from '../components/buttons/GitHubLoginButton'
import Screen from '../components/common/Screen'
import { ThemeConsumer } from '../components/context/ThemeContext'
import {
  UserConsumer,
  UserProviderState,
} from '../components/context/UserContext'
import { executeOAuth } from '../libs/oauth'
import { contentPadding } from '../styles/variables'

const logo = require('../../assets/logo.png') // tslint:disable-line
const pkg = require('../../package.json') // tslint:disable-line

const serverURL = 'https://micro-oauth-pmkvlpfaua.now.sh'

export interface LoginScreenProps {
  error: string
  refetchUser: UserProviderState['refetchUser']
  setAccessToken: UserProviderState['setAccessToken']
}

export interface LoginScreenState {
  isLoggingIn: boolean
  loggingInMethod: 'github.public' | 'github.private' | null
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    padding: contentPadding,
    width: '100%',
  } as ViewStyle,

  header: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  mainContentContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,

  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: contentPadding,
  } as ViewStyle,

  logo: {
    alignSelf: 'center',
    borderRadius: 100 / 8,
    height: 100,
    marginBottom: contentPadding / 2,
    width: 100,
  } as ImageStyle,

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 26,
  } as TextStyle,

  subtitle: {
    fontSize: 14,
    lineHeight: 18,
  } as TextStyle,

  button: {
    alignSelf: 'stretch',
    marginTop: contentPadding / 2,
  } as ImageStyle,

  appVersion: {
    fontSize: 14,
    lineHeight: 18,
  } as TextStyle,
})

export class LoginScreenComponent extends PureComponent<
  LoginScreenProps & NavigationScreenProps,
  LoginScreenState
> {
  static navigationOptions: NavigationStackScreenOptions = {
    header: null,
  }

  state: LoginScreenState = {
    isLoggingIn: false,
    loggingInMethod: null,
  }

  loginWithGithubPrivateAccess = async () => {
    this.setState({ isLoggingIn: true, loggingInMethod: 'github.private' })

    try {
      const params = await executeOAuth(serverURL, [
        'user',
        'repo',
        'notifications',
        'read:org',
      ])

      // this.props.navigation.navigate('AuthLoading')

      await this.props.setAccessToken((params && params.access_token) || null)
      const user = await this.props.refetchUser()

      if (user) {
        this.props.navigation.navigate('App')
        return
      }
    } catch (e) {
      console.error(e)
      alert(`Login failed. ${e || ''}`)
    }

    this.setState({ isLoggingIn: false })
  }

  loginWithGithubPublicAccess = async () => {
    this.setState({ isLoggingIn: true, loggingInMethod: 'github.public' })

    try {
      const params = await executeOAuth(serverURL, [
        'user',
        'public_repo',
        'notifications',
        'read:org',
      ])

      // this.props.navigation.navigate('AuthLoading')

      await this.props.setAccessToken((params && params.access_token) || null)
      const user = await this.props.refetchUser()

      if (user) {
        this.props.navigation.navigate('App')
        return
      }
    } catch (e) {
      console.error(e)
      alert(`Login failed. ${e}`)
    }

    this.setState({ isLoggingIn: false })
  }

  render() {
    const { isLoggingIn, loggingInMethod } = this.state

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <Screen>
            <View style={styles.container}>
              <View style={styles.header} />

              <View style={styles.mainContentContainer}>
                <Image resizeMode="contain" source={logo} style={styles.logo} />

                <GitHubLoginButton
                  loading={isLoggingIn && loggingInMethod === 'github.public'}
                  onPress={this.loginWithGithubPublicAccess}
                  rightIcon="globe"
                  style={styles.button}
                  subtitle="Public access"
                  title="Sign in with GitHub"
                />

                <GitHubLoginButton
                  loading={isLoggingIn && loggingInMethod === 'github.private'}
                  onPress={this.loginWithGithubPrivateAccess}
                  rightIcon="lock"
                  style={styles.button}
                  subtitle="Private access"
                  title="Sign in with GitHub"
                />
              </View>

              <View style={styles.footer}>
                <Text style={[styles.title, { color: theme.foregroundColor }]}>
                  DevHub
                </Text>
                <Text
                  style={[styles.subtitle, { color: theme.foregroundColor }]}
                >
                  TweetDeck for GitHub
                </Text>
                <Text
                  style={[
                    styles.appVersion,
                    { color: theme.foregroundColorTransparent50 },
                  ]}
                >{`v${pkg.version}`}</Text>
              </View>
            </View>
          </Screen>
        )}
      </ThemeConsumer>
    )
  }
}

export const LoginScreen = (
  props: typeof LoginScreenComponent.prototype.props,
) => (
  <UserConsumer>
    {({ refetchUser, setAccessToken }) => (
      <LoginScreenComponent
        {...props}
        refetchUser={refetchUser}
        setAccessToken={setAccessToken}
      />
    )}
  </UserConsumer>
)

LoginScreen.navigationOptions = LoginScreenComponent.navigationOptions
