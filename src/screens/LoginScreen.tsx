import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'
import { connect } from 'react-redux'

import { GitHubLoginButton } from '../components/buttons/GitHubLoginButton'
import { Screen } from '../components/common/Screen'
import { ThemeConsumer } from '../components/context/ThemeContext'
import { executeOAuth } from '../libs/oauth'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { contentPadding } from '../styles/variables'
import { ExtractPropsFromConnector } from '../types'

const logo = require('../../assets/logo.png') // tslint:disable-line
const pkg = require('../../package.json') // tslint:disable-line

const serverURL = 'https://micro-oauth-pmkvlpfaua.now.sh'

export interface LoginScreenProps {}

export interface LoginScreenState {
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

const connectToStore = connect(
  (state: any) => ({
    isLoggingIn: selectors.isLoggingInSelector(state),
    user: selectors.currentUserSelector(state),
  }),
  {
    login: actions.loginRequest,
  },
)

export class LoginScreenComponent extends PureComponent<
  LoginScreenProps &
    ExtractPropsFromConnector<typeof connectToStore> &
    NavigationScreenProps,
  LoginScreenState
> {
  static navigationOptions: NavigationStackScreenOptions = {
    header: null,
  }

  state: LoginScreenState = {
    loggingInMethod: null,
  }

  _loginWithGitHub = async (
    loggingInMethod: LoginScreenState['loggingInMethod'],
  ) => {
    this.setState({ loggingInMethod })

    const permissions =
      loggingInMethod === 'github.private'
        ? ['user', 'repo', 'notifications', 'read:org']
        : ['user', 'public_repo', 'notifications', 'read:org']

    let token
    try {
      const params = await executeOAuth(serverURL, permissions)
      if (!(params && params.access_token))
        throw new Error('No token received.')

      token = params.access_token
    } catch (e) {
      console.error(e)
      alert(`Login failed. ${e || ''}`)
      return
    }

    await this.props.login({ token })
  }

  loginWithGitHubPrivateAccess = () => this._loginWithGitHub('github.private')

  loginWithGitHubPublicAccess = () => this._loginWithGitHub('github.public')

  render() {
    const { loggingInMethod } = this.state
    const { isLoggingIn } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
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
                  onPress={this.loginWithGitHubPublicAccess}
                  rightIcon="globe"
                  style={styles.button}
                  subtitle="Public access"
                  title="Sign in with GitHub"
                />

                <GitHubLoginButton
                  loading={isLoggingIn && loggingInMethod === 'github.private'}
                  onPress={this.loginWithGitHubPrivateAccess}
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

export const LoginScreen = connectToStore(LoginScreenComponent)

hoistNonReactStatics(LoginScreen, LoginScreenComponent as any)
