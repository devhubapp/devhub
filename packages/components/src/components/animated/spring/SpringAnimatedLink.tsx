import { Link, LinkProps } from '../../common/Link'
import { createSpringAnimatedComponent } from './helpers'

export const SpringAnimatedLink = createSpringAnimatedComponent(Link)

export interface SpringAnimatedLinkProps extends LinkProps {}
