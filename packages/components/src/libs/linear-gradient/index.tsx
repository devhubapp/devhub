import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient'

import { createSpringAnimatedComponent } from '../../components/animated/spring/helpers'

export { LinearGradient }

export interface SpringAnimatedLinearGradientProps
  extends Omit<LinearGradientProps, 'colors'> {
  colors: (string | any)[]
}

export const SpringAnimatedLinearGradient = createSpringAnimatedComponent(
  LinearGradient,
)
SpringAnimatedLinearGradient.displayName = 'SpringAnimatedLinearGradient'
