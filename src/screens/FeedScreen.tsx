import React, { PureComponent } from 'react'
import {
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import Columns from '../components/columns/Columns'
import EventColumn from '../components/columns/EventColumn'
import Screen from '../components/common/Screen'

export default class FeedScreen extends PureComponent<NavigationScreenProps> {
  static navigationOptions: NavigationScreenConfig<
    NavigationStackScreenOptions
  > = {
    header: null,
    title: 'Feed',
  }

  componentWillMount() {
    this.props.navigation.setParams({
      handlePress: this.handlePress,
      subtitle: 'dashboard',
      title: 'brunolemos',
    })
  }

  handlePress = () => {
    // Alert.alert('Pressed!', 'Not implemented.')
  }

  render() {
    return (
      <Screen>
        <Columns>
          <EventColumn
            subtype="received_events"
            type="users"
            username="brunolemos"
          />
          <EventColumn subtype="events" type="users" username="brunolemos" />
        </Columns>
      </Screen>
    )
  }
}
