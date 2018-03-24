import React, { PureComponent } from 'react'
import { NavigationScreenProps } from 'react-navigation'

import Screen from '../components/common/Screen'

// TODO
export default class AuthLoadingScreen extends PureComponent<
  NavigationScreenProps
> {
  static navigationOptions = {}

  render() {
    return <Screen />
  }
}
