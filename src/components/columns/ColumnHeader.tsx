import React, { PureComponent, ReactNode } from 'react'
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { contentPadding } from '../../styles/variables'

export interface IProps extends ViewProps {
  children?: ReactNode
  maxWidth?: number
  style?: ViewStyle
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    minHeight: 48,
    paddingVertical: contentPadding,
  } as ViewStyle,

  buttonContainer: {} as ViewStyle,
})

export default class ColumnHeader extends PureComponent<IProps> {
  render() {
    const { children, style, ...props } = this.props

    return (
      <View {...props} style={[styles.container, style]}>
        {children}
      </View>
    )
  }
}
