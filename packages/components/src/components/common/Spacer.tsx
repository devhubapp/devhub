import React from 'react'
import { View, ViewStyle } from 'react-native'

export type SpacerProps = Pick<
  ViewStyle,
  'flex' | 'width' | 'height' | 'minWidth' | 'minHeight' | 'backgroundColor'
>

export function Spacer(props: SpacerProps) {
  return <View style={props} />
}
