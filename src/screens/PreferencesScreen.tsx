import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { INavigator } from 'react-native-navigation'

import Screen from '../components/common/Screen'
import theme from '../styles/themes/dark'

export interface IProps {
  navigator: INavigator
}

export default class NotificationsScreen extends PureComponent<IProps> {
  static componentId = 'org.brunolemos.devhub.PreferencesScreen'

  static navigatorStyle = {
    navBarBackgroundColor: theme.base00,
    screenBackgroundColor: theme.base00,
  }

  componentWillMount() {
    this.props.navigator.setTitle({ title: 'Preferences' })
  }

  render() {
    return (
      <Screen>
        <View />
      </Screen>
    )
  }
}
