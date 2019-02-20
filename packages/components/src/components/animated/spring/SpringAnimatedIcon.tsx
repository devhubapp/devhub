import { Omit } from '@devhub/core'
import { OcticonIconProps, Octicons as Icon } from '../../../libs/vector-icons'
import { createSpringAnimatedComponent } from './helpers'

export interface SpringAnimatedIconProps
  extends Omit<OcticonIconProps, 'color'> {}

export const SpringAnimatedIcon = createSpringAnimatedComponent(Icon)
