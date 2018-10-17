import React, { AnchorHTMLAttributes, SFC } from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

import { Browser } from '../../libs/browser'
import { Platform } from '../../libs/platform'

export interface LinkProps extends TouchableOpacityProps {
  webProps?: AnchorHTMLAttributes<HTMLAnchorElement>
  openOnNewTab?: boolean
  mobileProps?: TouchableOpacityProps
  href?: string
}

export const Link: SFC<LinkProps> = ({
  href,
  mobileProps,
  openOnNewTab = true,
  webProps,
  ...props
}) => (
  <TouchableOpacity
    {...Platform.select({
      default: {
        onPress: href ? () => Browser.openURL(href) : undefined,
        ...props,
        ...mobileProps,
      } as any,

      web: {
        accessibilityRole: 'link',
        href,
        target: openOnNewTab ? '_blank' : undefined,
        ...props,
        ...webProps,
      } as any,
    })}
  />
)
