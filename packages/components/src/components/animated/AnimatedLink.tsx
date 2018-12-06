import React from 'react'

import { Omit } from '@devhub/core'
import { Link, LinkProps } from '../common/Link'

export interface AnimatedLinkProps extends Omit<LinkProps, 'animated'> {
  style: any
}

export const AnimatedLink = (props: AnimatedLinkProps) => <Link {...props} />
