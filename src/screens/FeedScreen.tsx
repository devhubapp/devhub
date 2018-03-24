import React, { PureComponent } from 'react'
import { Alert } from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'
import { NavigationScreenConfig, NavigationScreenProps } from 'react-navigation'
import HeaderButtons from 'react-navigation-header-buttons'

import Avatar from '../components/common/Avatar'
import Screen from '../components/common/Screen'
import EventCardsContainer from '../containers/EventCardsContainer'
import theme from '../styles/themes/dark'
import { contentPadding } from '../styles/variables'

export default class FeedScreen extends PureComponent<NavigationScreenProps> {
  static navigationOptions: NavigationScreenConfig<any> = ({ navigation }) => {
    const params = navigation.state.params || {}

    return {
      headerLeft: (
        <HeaderButtons
          IconComponent={Octicons}
          color={theme.base04}
          iconSize={24}
        >
          <HeaderButtons.Item
            IconElement={<Avatar linkURL="" size={24} username="brunolemos" />}
            buttonWrapperStyle={{ marginLeft: contentPadding }}
            title="select"
          />
        </HeaderButtons>
      ),
      headerRight: (
        <HeaderButtons
          IconComponent={Octicons}
          color={theme.base04}
          iconSize={24}
        >
          <HeaderButtons.Item
            title="Settings"
            iconName="settings"
            onPress={params.handlePress}
          />
        </HeaderButtons>
      ),
      headerTitle: 'brunolemos',
      title: 'Feed',
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({
      handlePress: this.handlePress,
      subtitle: 'dashboard',
      title: 'brunolemos',
    })
  }

  handlePress = () => {
    Alert.alert('Pressed!', 'Not implemented.')
  }

  render() {
    return (
      <Screen>
        <EventCardsContainer />
      </Screen>
    )
  }
}
