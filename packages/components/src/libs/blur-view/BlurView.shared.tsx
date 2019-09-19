// Source: https://github.com/expo/expo/tree/master/packages/expo-blur

import { ViewProps } from 'react-native'

export type BlurTint = 'light' | 'dark' | 'default'

export interface BlurProps {
  tint?: BlurTint
  intensity?: number
}

export interface BlurViewProps extends BlurProps, ViewProps {
  children: React.ReactNode
}

export function getBackgroundColor(intensity: number, tint: BlurTint): string {
  const opacity = intensity / 100

  switch (tint) {
    case 'dark':
      return `rgba(0,0,0,${opacity * 0.5})`

    case 'light':
      return `rgba(255,255,255,${opacity * 0.7})`

    case 'default':
      return `rgba(255,255,255,${opacity * 0.4})`
  }
  throw new Error(`Unsupported tint provided: ${tint}`)
}
