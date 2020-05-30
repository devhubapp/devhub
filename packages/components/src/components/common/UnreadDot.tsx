import { ThemeColors } from '@devhub/core'
import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

import { scaleFactor } from '../../styles/variables'
import { useTheme } from '../context/ThemeContext'
import { ThemedView } from '../themed/ThemedView'

export const defaultUnreadIndicatorSize = 12 * scaleFactor

export interface UnreadDotProps {
  backgroundColor?: keyof ThemeColors
  borderColor?: keyof ThemeColors | null
  style?: ViewProps['style']
}
export const UnreadDot = React.forwardRef<ThemedView, UnreadDotProps>(
  (props, ref) => {
    const { backgroundColor, borderColor, style } = props

    // ps: not using ThemedView on purpose
    // to avoid conflict with setNativeProps (used by sidebar)
    const theme = useTheme()

    return (
      <View
        ref={ref}
        style={[
          borderColor === 'transparent' || borderColor === null
            ? styles.unreadIndicator_noborder
            : styles.unreadIndicator,
          style,
          {
            backgroundColor: theme[backgroundColor || 'primaryBackgroundColor'],
            borderColor: theme[borderColor || 'backgroundColor'],
          },
        ]}
      />
    )
  },
)

UnreadDot.displayName = 'UnreadDot'

const styles = StyleSheet.create({
  unreadIndicator: {
    width: defaultUnreadIndicatorSize,
    height: defaultUnreadIndicatorSize,
    borderWidth: 2,
    borderRadius: defaultUnreadIndicatorSize / 2,
  },
  unreadIndicator_noborder: {
    width: defaultUnreadIndicatorSize - 4 * scaleFactor,
    height: defaultUnreadIndicatorSize - 4 * scaleFactor,
    borderWidth: 0,
    borderRadius: (defaultUnreadIndicatorSize - 4) / 2,
  },
})
