import React, { PureComponent } from 'react'
import { Button, View } from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import Screen from '../components/common/Screen'
import {
  UserConsumer,
  UserProviderState,
} from '../components/context/UserContext'
import * as colors from '../styles/colors'

export interface LoginScreenProps {
  setAccessToken: UserProviderState['setAccessToken']
}

class SettingsScreenComponent extends PureComponent<
  LoginScreenProps & NavigationScreenProps
> {
  static navigationOptions: NavigationStackScreenOptions = {
    headerTitle: 'Settings',
  }

  logout = () => {
    this.props.setAccessToken(null)
    this.props.navigation.navigate('Login')
  }

  render() {
    return (
      <Screen>
        <View>
          <Button color={colors.red} title="Logout" onPress={this.logout} />
        </View>
      </Screen>
    )
  }
}

export const SettingsScreen = (
  props: typeof SettingsScreenComponent.prototype.props,
) => (
  <UserConsumer>
    {({ setAccessToken }) => (
      <SettingsScreenComponent {...props} setAccessToken={setAccessToken} />
    )}
  </UserConsumer>
)

SettingsScreen.navigationOptions = SettingsScreenComponent.navigationOptions
