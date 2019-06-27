import { Link, LinkProps } from '../../common/Link'

export interface SpringAnimatedLinkProps extends LinkProps {}

// Link internals already use spring animated components
export const SpringAnimatedLink = Link
;(SpringAnimatedLink as any).displayName = 'SpringAnimatedLink'
