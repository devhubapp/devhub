import { Link, LinkProps } from '../../common/Link'
import { createSpringAnimatedComponent } from './helpers'

export interface SpringAnimatedLinkProps extends LinkProps {}

export const SpringAnimatedLink = createSpringAnimatedComponent(Link)
