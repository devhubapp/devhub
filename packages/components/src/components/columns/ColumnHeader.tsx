import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { columnHeaderHeight, contentPadding } from '../../styles/variables'
import { SpringAnimatedSafeAreaView } from '../animated/spring/SpringAnimatedSafeAreaView'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'

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
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const { children, style, ...otherProps } = props

  return (
    <SpringAnimatedSafeAreaView
      style={[
        styles.container,
        { backgroundColor: springAnimatedTheme.backgroundColorLess08 },
      ]}
    >
      <View {...otherProps} style={[styles.innerContainer, style]}>
        {children}
      </View>

      <CardItemSeparator />
    </SpringAnimatedSafeAreaView>
  )
}
