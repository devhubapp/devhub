import { SafeAreaView, ViewProps } from 'react-native'

import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedSafeAreaView = createSpringAnimatedComponent(
  SafeAreaView,
)

export interface SpringAnimatedSafeAreaViewProps extends ViewProps {}
