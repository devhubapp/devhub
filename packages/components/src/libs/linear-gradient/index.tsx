import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient'

import { Omit } from '@devhub/core'
import { createSpringAnimatedComponent } from '../../components/animated/spring/helpers'

export { LinearGradient, LinearGradientProps }

export interface SpringAnimatedLinearGradientProps
  extends Omit<LinearGradientProps, 'colors'> {
  colors: Array<string | any>
}

export const SpringAnimatedLinearGradient = createSpringAnimatedComponent(
  LinearGradient,
)
