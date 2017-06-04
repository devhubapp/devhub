// @flow

import React from 'react'
import { View } from 'react-native'

export default class OptimizedListItem extends React.PureComponent {
  state = {
    visibility: true,
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  onLayout = evt => {
    if (!this.mounted) return

    this.viewProperties.width = evt.nativeEvent.layout.width
    this.viewProperties.height = evt.nativeEvent.layout.height
  }

  setVisibility = visibility => {
    if (!this.mounted) return

    if (this.state.visibility !== visibility) {
      if (visibility) this.setState({ visibility: true })
      else this.setState({ visibility: false })
    }
  }

  mounted = false
  viewProperties = { width: 0, height: 0 }

  props: {
    viewComponent: ReactClass<any>,
  }

  render() {
    if (!this.state.visibility) {
      return (
        <View
          style={{
            width: this.viewProperties.width,
            height: this.viewProperties.height,
          }}
        />
      )
    }

    return (
      <View onLayout={this.onLayout} style={{ flex: 1 }}>
        {this.props.viewComponent}
      </View>
    )
  }
}
