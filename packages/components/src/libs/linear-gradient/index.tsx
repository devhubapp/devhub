import { Omit } from '@devhub/core'
import { ComponentClass } from 'react'
import { Animated } from 'react-native'
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient'

export { LinearGradient, LinearGradientProps }

export interface AnimatedLinearGradientProps
  extends Omit<LinearGradientProps, 'colors'> {
  colors: Array<string | Animated.AnimatedInterpolation>
}

export const AnimatedLinearGradient = Animated.createAnimatedComponent(
  LinearGradient,
) as ComponentClass<AnimatedLinearGradientProps>
