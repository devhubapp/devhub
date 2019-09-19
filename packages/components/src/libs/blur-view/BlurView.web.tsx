// Source: https://github.com/expo/expo/tree/master/packages/expo-blur

import React from 'react'
import { View } from 'react-native'

import { BlurProps, BlurViewProps, getBackgroundColor } from './BlurView.shared'

export function BlurView(props: BlurViewProps) {
  const { tint, intensity, style } = props

  const blurStyle = getBlurStyle({ tint, intensity })

  return <View {...props} style={[style, blurStyle]} />
}

BlurView.isBlurSupported = () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/CSS/supports
  // https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility
  return (
    typeof CSS !== 'undefined' &&
    (CSS.supports('-webkit-backdrop-filter', 'blur(1px)') ||
      CSS.supports('backdrop-filter', 'blur(1px)'))
  )
}

function getBlurStyle({
  intensity = 50,
  tint = 'default',
}: BlurProps): { [key: string]: string } {
  if (BlurView.isBlurSupported()) {
    let backdropFilter = `blur(${intensity * 0.25}px)`

    if (tint === 'dark') {
      backdropFilter += ' brightness(50%)'
    } else if (tint === 'light') {
      backdropFilter += ' brightness(150%)'
    }

    return { backdropFilter }
  }

  return { backgroundColor: getBackgroundColor(intensity, tint) }
}
