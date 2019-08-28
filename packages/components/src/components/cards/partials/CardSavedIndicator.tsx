import React from 'react'
import { StyleSheet, View } from 'react-native'

import { contentPadding } from '../../../styles/variables'
import { Triangle } from '../../Triangle'

export interface CardSavedProps {}

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

export function CardSavedIndicator(_props: CardSavedProps) {
  return (
    <View style={styles.indicator}>
      <Triangle
        color="primaryBackgroundColor"
        degree={-90}
        size={contentPadding * (2 / 3)}
        type="border"
      />
    </View>
  )
}
