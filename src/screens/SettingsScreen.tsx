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

export interface SettingsScreenProps {}

class SettingsScreenComponent extends PureComponent<
  SettingsScreenProps &
    NavigationScreenProps & {
      setAccessToken: UserProviderState['setAccessToken']
    }
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
  props: SettingsScreenProps & NavigationScreenProps,
) => (
  <UserConsumer>
    {({ setAccessToken }) => (
      <SettingsScreenComponent {...props} setAccessToken={setAccessToken} />
    )}
  </UserConsumer>
)

SettingsScreen.navigationOptions = SettingsScreenComponent.navigationOptions
