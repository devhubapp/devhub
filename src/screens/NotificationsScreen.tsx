import React, { PureComponent } from 'react'
import { Alert } from 'react-native'
import { INavigator } from 'react-native-navigation'

import OcticonsIconButton, {
  IScreenIconProps as IOcticonsIconButtonIconProps,
} from '../components/common/OcticonsIconButton'
import Screen from '../components/common/Screen'
import NotificationCardsContainer from '../containers/NotificationCardsContainer'
import theme from '../styles/themes/dark'

export interface IProps {
  navigator: INavigator
}

export default class NotificationsScreen extends PureComponent<IProps> {
  static componentId = 'org.brunolemos.devhub.NotificationsScreen'

  static navigatorStyle = {}

  componentWillMount() {
    this.props.navigator.setTitle({ title: 'Notifications' })

    this.props.navigator.setButtons({
      leftButtons: [
        {
          component: OcticonsIconButton.componentId,
          id: 'settings',
          passProps: {
            color: theme.base04,
            name: 'settings',
            onPress: this.handlePress,
            size: 24,
          } as IOcticonsIconButtonIconProps,
        },
      ],
      rightButtons: [
        {
          component: OcticonsIconButton.componentId,
          id: 'more',
          passProps: {
            color: theme.base04,
            name: 'chevron-down',
            onPress: this.handlePress,
            size: 24,
          } as IOcticonsIconButtonIconProps,
        },
      ],
    })
  }

  handlePress = () => {
    Alert.alert('Pressed!', 'Not implemented.')
  }

  render() {
    return (
      <Screen>
        <NotificationCardsContainer />
      </Screen>
    )
  }
}
