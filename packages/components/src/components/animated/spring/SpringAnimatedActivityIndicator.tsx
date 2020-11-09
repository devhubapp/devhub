import { ActivityIndicator, ActivityIndicatorProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export type SpringAnimatedActivityIndicatorProps = ActivityIndicatorProps

export const SpringAnimatedActivityIndicator = createSpringAnimatedComponent(
  ActivityIndicator,
)
SpringAnimatedActivityIndicator.displayName = 'SpringAnimatedActivityIndicator'
