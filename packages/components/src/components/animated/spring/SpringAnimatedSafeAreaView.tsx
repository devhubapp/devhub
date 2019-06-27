import { ViewProps } from 'react-native'

import { SafeAreaView } from '../../../libs/safe-area-view'
import { createSpringAnimatedComponent } from './helpers'

export interface SpringAnimatedSafeAreaViewProps extends ViewProps {}

export const SpringAnimatedSafeAreaView = createSpringAnimatedComponent(
  SafeAreaView,
)
;(SpringAnimatedSafeAreaView as any).displayName = 'SpringAnimatedSafeAreaView'

export type SpringAnimatedSafeAreaView = SafeAreaView
