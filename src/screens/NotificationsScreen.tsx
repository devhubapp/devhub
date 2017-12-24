import React, { PureComponent } from 'react'

// import AvatarNavBarButton, {
//   IScreenIconProps as IAvatarNavBarButtonIconProps,
// } from '../components/common/AvatarNavBarButton'
import OcticonsIconButton, {
  IScreenIconProps as IOcticonsIconButtonIconProps,
} from '../components/common/OcticonsIconButton'
import NotificationCardsContainer from '../containers/NotificationCardsContainer'
import theme from '../styles/themes/dark'
import Screen from '../components/common/Screen'

export default class NotificationsScreen extends PureComponent {
  static componentId = 'org.brunolemos.devhub.NotificationsScreen'

  static navigatorStyle = {
    navBarBackgroundColor: theme.base00,
    screenBackgroundColor: theme.base00,
  }

  componentWillMount() {
    this.props.navigator.setTitle({ title: 'Notifications' })

    this.props.navigator.setButtons({
      leftButtons: [
        {
          component: OcticonsIconButton.componentId,
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
    alert('Pressed!')
  }

  render() {
    return <Screen />
  }
}
