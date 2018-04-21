import React, { PureComponent, ReactNode } from 'react'
import { SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native'

import theme from '../../styles/themes/dark'

export interface IProps {
  children?: ReactNode
  useSafeArea?: boolean
  style?: ViewStyle
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.base00,
    flex: 1,
  } as ViewStyle,
})

export default class Screen extends PureComponent<IProps> {
  static defaultProps = {
    useSafeArea: true,
  }

  render() {
    const { useSafeArea, style, ...props } = this.props

    if (useSafeArea)
      return <SafeAreaView {...props} style={[styles.container, style]} />

    return <View {...props} style={[styles.container, style]} />
  }
}
