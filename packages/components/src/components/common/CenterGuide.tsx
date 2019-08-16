import React from 'react'
import { StyleSheet, View } from 'react-native'
import { sharedStyles } from '../../styles/shared'

export interface CenterGuideProps {
  color?: string
  size?: number
}

export function CenterGuide(props: CenterGuideProps) {
  const { color = 'red', size = 1 } = props

  return (
    <View collapsable={false} style={StyleSheet.absoluteFill}>
      <View
        style={[
          sharedStyles.absolute,
          {
            top: 0,
            bottom: 0,
            left: '50%',
            width: size,
            marginLeft: -size / 2,
            backgroundColor: color,
          },
        ]}
      />

      <View
        style={[
          sharedStyles.absolute,
          {
            left: 0,
            right: 0,
            top: '50%',
            height: size,
            marginTop: -size / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  )
}
