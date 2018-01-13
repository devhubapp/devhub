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

export interface IProps {
  navigator: object
}

export default class FeedScreen extends PureComponent<IProps> {
  static componentId = 'org.brunolemos.devhub.FeedScreen'

  static navigatorStyle = {}

  componentWillMount() {
    this.props.navigator.setTitle({ title: 'react-native' }) // , subtitle: 'dashboard'

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
            username: 'facebook',
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
      <Screen>
        <EventCardsContainer />
      </Screen>
    )
  }
}
