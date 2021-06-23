import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../../common/TouchableOpacity'
import { createSpringAnimatedComponent } from './helpers'

export type SpringAnimatedTouchableOpacityProps = TouchableOpacityProps

export const SpringAnimatedTouchableOpacity =
  createSpringAnimatedComponent(TouchableOpacity)
SpringAnimatedTouchableOpacity.displayName = 'SpringAnimatedTouchableOpacity'
