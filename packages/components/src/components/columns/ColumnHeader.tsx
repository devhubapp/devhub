import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { columnHeaderHeight, contentPadding } from '../../styles/variables'
import { SpringAnimatedSafeAreaView } from '../animated/spring/SpringAnimatedSafeAreaView'
import { Separator } from '../common/Separator'
import { useTheme } from '../context/ThemeContext'

export function getColumnHeaderThemeColors(
  _backgroundColor?: string,
): {
  normal: keyof ThemeColors
  hover: keyof ThemeColors
  selected: keyof ThemeColors
} {
  // const luminance = getLuminance(backgroundColor)

  // if (luminance >= 0.5) {
  //   return {
  //     normal: 'backgroundColor',
  //     hover: 'backgroundColorLess1',
  //     selected: 'backgroundColorLess2',
  //   }
  // }

  // if (luminance <= 0.02) {
  //   return {
  //     normal: 'backgroundColor',
  //     hover: 'backgroundColorLess2',
  //     selected: 'backgroundColorLess4',
  //   }
  // }

  return {
    normal: 'backgroundColor',
    hover: 'backgroundColorLess2',
    selected: 'backgroundColorLess3',
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
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
  const theme = useTheme()

  const { children, noPadding, style, ...otherProps } = props

  return (
    <SpringAnimatedSafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            springAnimatedTheme[
              getColumnHeaderThemeColors(theme.backgroundColor).normal
            ],
        },
      ]}
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
    </SpringAnimatedSafeAreaView>
  )
}
