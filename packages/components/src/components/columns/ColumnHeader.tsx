import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { columnHeaderHeight, contentPadding } from '../../styles/variables'
import { AnimatedSafeAreaView } from '../animated/AnimatedSafeAreaView'
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
  const theme = useAnimatedTheme()

  const { children, style, ...otherProps } = props

  return (
    <AnimatedSafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.backgroundColorLess08 },
      ]}
    >
      <View {...otherProps} style={[styles.innerContainer, style]}>
        {children}
      </View>

      <CardItemSeparator />
    </AnimatedSafeAreaView>
  )
}
