import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { columnHeaderHeight, contentPadding } from '../../styles/variables'
import { Separator } from '../common/Separator'
import { ThemedSafeAreaView } from '../themed/ThemedSafeAreaView'

export function getColumnHeaderThemeColors(
  _backgroundColor?: string,
): {
  normal: keyof ThemeColors
  hover: keyof ThemeColors
  selected: keyof ThemeColors
} {
  return {
    normal: 'backgroundColor',
    hover: 'backgroundColorLess1',
    selected: 'backgroundColorLess2',
  }
}

export interface ColumnHeaderProps extends ViewProps {
  children?: ReactNode
  maxWidth?: number
  noPadding?: boolean
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
  },
})

export function ColumnHeader(props: ColumnHeaderProps) {
  const { children, noPadding, style, ...otherProps } = props

  return (
    <ThemedSafeAreaView
      backgroundColor={theme =>
        getColumnHeaderThemeColors(theme.backgroundColor).normal
      }
      style={styles.container}
    >
      <View
        {...otherProps}
        style={[
          styles.innerContainer,
          !noPadding && { paddingHorizontal: contentPadding / 2 },
          style,
        ]}
      >
        {children}
      </View>

      {!!children && <Separator horizontal />}
    </ThemedSafeAreaView>
  )
}
