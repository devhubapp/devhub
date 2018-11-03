import React from 'react'
import { View, ViewStyle } from 'react-native'

export type SpacerProps = Pick<
  ViewStyle,
  'flex' | 'width' | 'height' | 'minWidth' | 'minHeight' | 'backgroundColor'
>

export const Spacer: React.SFC<SpacerProps> = props => <View style={props} />
