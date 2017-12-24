import React, { PureComponent } from 'react'

import Screen from '../components/common/Screen'
import theme from '../styles/themes/dark'

export default class NotificationsScreen extends PureComponent {
  static componentId = 'org.brunolemos.devhub.PreferencesScreen'

  static navigatorStyle = {
    navBarBackgroundColor: theme.base00,
    screenBackgroundColor: theme.base00,
  }

  componentWillMount() {
    this.props.navigator.setTitle({ title: 'Preferences' })
  }

  render() {
    return <Screen />
  }
}
