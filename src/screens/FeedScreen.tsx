import React, { PureComponent } from 'react'

import AvatarNavBarButton, {
  IScreenIconProps as IAvatarNavBarButtonIconProps,
} from '../components/common/AvatarNavBarButton'
import OcticonsIconButton, {
  IScreenIconProps as IOcticonsIconButtonIconProps,
} from '../components/common/OcticonsIconButton'
import Screen from '../components/common/Screen'
import EventCardsContainer from '../containers/EventCardsContainer'
import theme from '../styles/themes/dark'

export default class FeedScreen extends PureComponent {
  static componentId = 'org.brunolemos.devhub.FeedScreen'

  static navigatorStyle = {}

  componentWillMount() {
    this.props.navigator.setTitle({ title: 'brunolemos' }) // , subtitle: 'dashboard'

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
        {
          component: AvatarNavBarButton.componentId,
          passProps: {
            onPress: this.handlePress,
            size: 24,
            username: 'brunolemos',
          } as IAvatarNavBarButtonIconProps,
        },
      ],
    })
  }

  handlePress = () => {
    alert('Pressed!')
  }

  render() {
    return (
      <Screen style={{ flex: 1 }}>
        <EventCardsContainer />
      </Screen>
    )
  }
}
