import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../../common/TouchableOpacity'
import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedTouchableOpacity = createSpringAnimatedComponent(
  TouchableOpacity,
)

export interface SpringAnimatedTouchableOpacityProps
  extends TouchableOpacityProps {}
