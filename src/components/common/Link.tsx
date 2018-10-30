import React, { AnchorHTMLAttributes, SFC } from 'react'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'

import { Browser } from '../../libs/browser'
import { Platform } from '../../libs/platform'

export interface LinkProps extends TouchableOpacityProps {
  allowEmptyLink?: boolean
  href?: string
  mobileProps?: TouchableOpacityProps
  openOnNewTab?: boolean
  webProps?: AnchorHTMLAttributes<HTMLAnchorElement>
}

export const Link: SFC<LinkProps> = ({
  allowEmptyLink,
  href,
  mobileProps,
  openOnNewTab = true,
  webProps,
  ...props
}) => {
  if (!href && !allowEmptyLink)
    return (
      <View
        {...Platform.select({
          default: {
            ...props,
            ...mobileProps,
          } as any,

          web: {
            ...props,
            ...webProps,
          } as any,
        })}
      />
    )

  return (
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
}
