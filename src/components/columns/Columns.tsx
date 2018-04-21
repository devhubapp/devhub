import React, { PureComponent, ReactFragment } from 'react'
import {
  ScrollView,
  ScrollViewProperties,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import theme from '../../styles/themes/dark'

export interface IProps extends ScrollViewProperties {
  children: ReactFragment
  contentContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  } as ViewStyle,

  contentContainer: {
    backgroundColor: theme.base01,
  } as ViewStyle,
})

export default class Columns extends PureComponent<IProps> {
  render() {
    const { children, style, ...props } = this.props

    return (
      <ScrollView
        contentContainerStyle={[styles.contentContainer, style]}
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
