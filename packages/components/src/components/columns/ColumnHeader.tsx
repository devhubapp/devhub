import { getLuminance } from 'polished'
import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { columnHeaderHeight, contentPadding } from '../../styles/variables'
import { SpringAnimatedSafeAreaView } from '../animated/spring/SpringAnimatedSafeAreaView'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { useTheme } from '../context/ThemeContext'

export function getColumnHeaderThemeColors(
  backgroundColor: string,
): { normal: keyof ThemeColors; hover: keyof ThemeColors } {
  const luminance = getLuminance(backgroundColor)

  if (luminance >= 0.5)
    return { normal: 'backgroundColorDarker1', hover: 'backgroundColorDarker2' }

  return {
    normal: 'backgroundColorLighther2',
    hover: 'backgroundColorLighther3',
  }
}

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
  const theme = useTheme()

  const { children, style, ...otherProps } = props

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
      <View {...otherProps} style={[styles.innerContainer, style]}>
        {children}
      </View>

      <CardItemSeparator />
    </SpringAnimatedSafeAreaView>
  )
}
