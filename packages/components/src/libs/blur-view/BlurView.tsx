import React from 'react'
import { View } from 'react-native'

import { BlurViewProps } from './BlurView.shared'

export function BlurView(props: BlurViewProps) {
  const { tint = 'default', intensity = 50, ...otherProps } = props
  return <View {...otherProps} />
}

BlurView.isBlurSupported = () => false
