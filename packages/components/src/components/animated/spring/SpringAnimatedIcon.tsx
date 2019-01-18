import { IconProps } from 'react-native-vector-icons/Icon'

import { Octicons as Icon } from '../../../libs/vector-icons'
import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedIcon = createSpringAnimatedComponent(Icon)

export interface SpringAnimatedIconProps extends IconProps {}
