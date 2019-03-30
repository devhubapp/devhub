import { ViewProps } from 'react-native'

import { SafeAreaView } from '../../../libs/safe-area-view'
import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedSafeAreaView = createSpringAnimatedComponent(
  SafeAreaView,
)

export interface SpringAnimatedSafeAreaViewProps extends ViewProps {}
