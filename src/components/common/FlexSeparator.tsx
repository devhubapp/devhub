import React, { PureComponent } from 'react'
import { View, ViewStyle } from 'react-native'

export class FlexSeparator extends PureComponent<ViewStyle> {
  static defaultProps: ViewStyle = {
    flex: 1,
  }

  render() {
    return <View style={this.props} />
  }
}
