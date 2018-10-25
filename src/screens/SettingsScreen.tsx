import React, { PureComponent } from 'react'
import { Button, View } from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'
import { connect } from 'react-redux'

import * as actions from '../redux/actions'

import { Screen } from '../components/common/Screen'
import * as colors from '../styles/colors'
import { ExtractPropsFromConnector } from '../types'

export interface SettingsScreenProps {}

const connectToStore = connect(
  null,
  { logout: actions.logout },
)

class SettingsScreenComponent extends PureComponent<
  SettingsScreenProps &
    ExtractPropsFromConnector<typeof connectToStore> &
    NavigationScreenProps
> {
  static navigationOptions: NavigationStackScreenOptions = {
    headerTitle: 'Settings',
  }

  logout = () => {
    this.props.logout()
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

export const SettingsScreen = connectToStore(SettingsScreenComponent)
