import React from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'

export type SpacerProps = Pick<
  ViewStyle,
  'flex' | 'width' | 'height' | 'minWidth' | 'minHeight' | 'backgroundColor'
> &
  Pick<ViewProps, 'pointerEvents'>

export function Spacer(props: SpacerProps) {
  const { pointerEvents = 'none', ...style } = props
  return <View style={style} pointerEvents={pointerEvents} />
}
