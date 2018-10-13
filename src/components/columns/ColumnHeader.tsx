import React, { PureComponent, ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { contentPadding } from '../../styles/variables'
import { ThemeConsumer } from '../context/ThemeContext'
import { columnHeaderItemContentSize } from './ColumnHeaderItem'

export const columnHeaderHeight = 64

export interface ColumnHeaderProps extends ViewProps {
  children?: ReactNode
  maxWidth?: number
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: contentPadding * 2 + columnHeaderItemContentSize,
    paddingVertical: contentPadding,
  },

  buttonContainer: {},
})

export default class ColumnHeader extends PureComponent<ColumnHeaderProps> {
  render() {
    const { children, style, ...props } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <View
            {...props}
            style={[
              styles.container,
              { backgroundColor: theme.backgroundColorLess08 },
              style,
            ]}
          >
            {children}
          </View>
        )}
      </ThemeConsumer>
    )
  }
}
