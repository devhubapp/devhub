import React, { PureComponent } from 'react'
import {
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'

import Screen from '../components/common/Screen'
import { ColumnsContainer } from '../containers/ColumnsContainer'

export class FeedScreen extends PureComponent<NavigationScreenProps> {
  static navigationOptions: NavigationScreenConfig<
    NavigationStackScreenOptions
  > = {
    header: null,
  }

  render() {
    return (
      <Screen>
        <ColumnsContainer onlyEvents />
      </Screen>
    )
  }
}
