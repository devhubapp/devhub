import React, { PureComponent, ReactNode } from 'react'
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { contentPadding } from '../../styles/variables'
import { ThemeConsumer } from '../context/ThemeContext'
import { columnHeaderItemContentSize } from './ColumnHeaderItem'

export const columnHeaderHeight =
  contentPadding * 2 + columnHeaderItemContentSize

export interface ColumnHeaderProps extends ViewProps {
  children?: ReactNode
  maxWidth?: number
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  innerContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: columnHeaderHeight,
    paddingVertical: contentPadding,
  },
})

export class ColumnHeader extends PureComponent<ColumnHeaderProps> {
  render() {
    const { children, style, ...props } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <SafeAreaView
            style={[
              styles.container,
              { backgroundColor: theme.backgroundColorLess08 },
            ]}
          >
            <View {...props} style={[styles.innerContainer, style]}>
              {children}
            </View>
          </SafeAreaView>
        )}
      </ThemeConsumer>
    )
  }
}
