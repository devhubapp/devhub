import { OcticonIconProps, Octicons as Icon } from '../../../libs/vector-icons'
import { createSpringAnimatedComponent } from './helpers'

export type SpringAnimatedIconProps = Omit<OcticonIconProps, 'color'>

export const SpringAnimatedIcon = createSpringAnimatedComponent(Icon)
SpringAnimatedIcon.displayName = 'SpringAnimatedIcon'
