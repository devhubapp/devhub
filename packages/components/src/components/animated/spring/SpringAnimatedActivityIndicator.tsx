import { ActivityIndicator, ActivityIndicatorProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedActivityIndicator = createSpringAnimatedComponent(
  ActivityIndicator,
)

export interface SpringAnimatedActivityIndicatorProps
  extends ActivityIndicatorProps {}
