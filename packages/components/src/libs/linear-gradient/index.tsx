import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient'

import { Omit } from '@devhub/core'
import { createAnimatedComponent } from '../../components/animated/helpers'

export { LinearGradient, LinearGradientProps }

export interface AnimatedLinearGradientProps
  extends Omit<LinearGradientProps, 'colors'> {
  colors: Array<string | any>
}

export const AnimatedLinearGradient = createAnimatedComponent(LinearGradient)
