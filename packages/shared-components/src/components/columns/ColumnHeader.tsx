import React, { ReactNode } from 'react'
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { columnHeaderHeight, contentPadding } from '../../styles/variables'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { useTheme } from '../context/ThemeContext'

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
    paddingHorizontal: contentPadding / 2,
  },
})

export function ColumnHeader(props: ColumnHeaderProps) {
  const theme = useTheme()

  const { children, style, ...otherProps } = props

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.backgroundColorLess08 },
      ]}
    >
      <View {...otherProps} style={[styles.innerContainer, style]}>
        {children}
      </View>

      <CardItemSeparator />
    </SafeAreaView>
  )
}
