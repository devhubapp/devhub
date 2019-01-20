import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../../common/TouchableOpacity'
import { createSpringAnimatedComponent } from './helpers'

export interface SpringAnimatedTouchableOpacityProps
  extends TouchableOpacityProps {}

export const SpringAnimatedTouchableOpacity = createSpringAnimatedComponent(
  TouchableOpacity,
)
