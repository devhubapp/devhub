import React, { PureComponent, ReactFragment } from 'react'
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

export interface IProps extends ScrollViewProps {
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

export default class Columns extends PureComponent<IProps> {
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
