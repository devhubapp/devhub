import { ActivityIndicator, ActivityIndicatorProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export interface SpringAnimatedActivityIndicatorProps
  extends ActivityIndicatorProps {}

export const SpringAnimatedActivityIndicator = createSpringAnimatedComponent(
  ActivityIndicator,
)
