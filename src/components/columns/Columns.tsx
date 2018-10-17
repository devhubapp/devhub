import React, { PureComponent, ReactFragment } from 'react'
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

export interface ColumnsProps extends ScrollViewProps {
  children: ReactFragment
  contentContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
})

export class Columns extends PureComponent<ColumnsProps> {
  render() {
    const { children, style, ...props } = this.props

    return (
      <ScrollView
        contentContainerStyle={style}
        horizontal
        pagingEnabled
        {...props}
        style={[styles.container, style]}
      >
        {children}
      </ScrollView>
    )
  }
}
