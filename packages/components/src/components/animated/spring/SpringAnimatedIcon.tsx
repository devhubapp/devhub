import { IconProps } from 'react-native-vector-icons/Icon'

import { Omit } from '@devhub/core'
import { Octicons as Icon } from '../../../libs/vector-icons'
import { createSpringAnimatedComponent } from './helpers'

export interface SpringAnimatedIconProps extends Omit<IconProps, 'color'> {}

export const SpringAnimatedIcon = createSpringAnimatedComponent(
  Icon,
) as React.ForwardRefExoticComponent<
  SpringAnimatedIconProps & React.RefAttributes<Icon>
>
