import React, { PureComponent } from 'react'
import { Button, View } from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import Screen from '../components/common/Screen'
import { UserConsumer } from '../components/context/UserContext'
import theme from '../styles/themes/dark'

export default class SettingsScreen extends PureComponent<
  NavigationScreenProps
> {
  static navigationOptions: NavigationStackScreenOptions = {
    headerTitle: 'Settings',
  }

  render() {
    return (
      <UserConsumer>
        {({ setAccessToken }) => (
          <Screen>
            <View>
              <Button
                color={theme.red}
                title="Logout"
                onPress={() => {
                  setAccessToken(null)
                  this.props.navigation.navigate('Login')
                }}
              />
            </View>
          </Screen>
        )}
      </UserConsumer>
    )
  }
}
