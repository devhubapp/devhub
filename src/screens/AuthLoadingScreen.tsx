import React, { PureComponent } from 'react'
import { ActivityIndicator, StatusBar, StyleSheet } from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import { Screen } from '../components/common/Screen'
import {
  UserConsumer,
  UserProviderState,
} from '../components/context/UserContext'
import * as colors from '../styles/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export interface AuthLoadingScreenProps extends UserProviderState {}

export class AuthLoadingScreenComponent extends PureComponent<
  AuthLoadingScreenProps & NavigationScreenProps
> {
  static navigationOptions: NavigationStackScreenOptions = {
    header: null,
  }

  async componentDidUpdate(prevProps: AuthLoadingScreenProps) {
    if (this.props.user !== prevProps.user) {
      this.props.navigation.navigate(
        this.props.accessToken && this.props.user ? 'App' : 'Auth',
      )
    } else if (this.props.accessToken !== prevProps.accessToken) {
      if (this.props.accessToken) {
        this.props.navigation.navigate('AuthLoading')
        const user = await this.props.refetchUser()
        this.props.navigation.navigate(user ? 'App' : 'Auth')
      } else {
        this.props.navigation.navigate('Auth')
      }
    }
  }

  render() {
    return (
      <Screen style={styles.container}>
        <StatusBar hidden />
        <ActivityIndicator color={colors.brand} />
      </Screen>
    )
  }
}

export const AuthLoadingScreen = (
  props: typeof AuthLoadingScreenComponent.prototype.props,
) => (
  <UserConsumer>
    {({ accessToken, refetchUser, hasLoadedFromCache, user }) => (
      <AuthLoadingScreenComponent
        {...props}
        accessToken={accessToken}
        hasLoadedFromCache={hasLoadedFromCache}
        refetchUser={refetchUser}
        user={user}
      />
    )}
  </UserConsumer>
)

AuthLoadingScreen.navigationOptions =
  AuthLoadingScreenComponent.navigationOptions
