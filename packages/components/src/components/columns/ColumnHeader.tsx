import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { useReduxState } from '../../hooks/use-redux-state'
import { useSafeArea } from '../../libs/safe-area-view'
import * as selectors from '../../redux/selectors'
import { columnHeaderHeight, contentPadding } from '../../styles/variables'
import { Separator } from '../common/Separator'
import { ThemedView } from '../themed/ThemedView'

export function getColumnHeaderThemeColors(): {
  normal: keyof ThemeColors
  hover: keyof ThemeColors
  selected: keyof ThemeColors
} {
  return {
    normal: 'backgroundColor', // backgroundColor
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

  const safeAreaInsets = useSafeArea()
  const bannerMessage = useReduxState(selectors.bannerMessageSelector)

  return (
    <ThemedView
      backgroundColor={getColumnHeaderThemeColors().normal}
      style={[
        styles.container,
        {
          paddingTop:
            bannerMessage && bannerMessage.message ? 0 : safeAreaInsets.top,
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
    </ThemedView>
  )
}
