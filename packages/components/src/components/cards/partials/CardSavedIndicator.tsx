import React from 'react'
import { StyleSheet, View } from 'react-native'

import { contentPadding } from '../../../styles/variables'
import { ThemedViewProps } from '../../themed/ThemedView'
import { Triangle } from '../../Triangle'

export interface CardSavedProps {
  style?: ThemedViewProps['style']
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: contentPadding * (2 / 3),
    height: contentPadding * (2 / 3),
    zIndex: 1000,
  },
})

export const CardSavedIndicator = React.forwardRef<View, CardSavedProps>(
  (props, ref) => {
    const { style } = props

    return (
      <View ref={ref} style={[styles.indicator, style]} pointerEvents="none">
        <Triangle
          color="primaryBackgroundColor"
          degree={-90}
          size={contentPadding * (2 / 3)}
          type="border"
        />
      </View>
    )
  },
)
