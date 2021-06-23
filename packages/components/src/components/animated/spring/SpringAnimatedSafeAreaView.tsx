import { ViewProps } from 'react-native'

import { SafeAreaView } from '../../../libs/safe-area-view'
import { createSpringAnimatedComponent } from './helpers'

export type SpringAnimatedSafeAreaViewProps = ViewProps

export const SpringAnimatedSafeAreaView =
  createSpringAnimatedComponent(SafeAreaView)
SpringAnimatedSafeAreaView.displayName = 'SpringAnimatedSafeAreaView'

export type SpringAnimatedSafeAreaView = SafeAreaView
