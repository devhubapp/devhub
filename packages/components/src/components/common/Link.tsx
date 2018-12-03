import React, { AnchorHTMLAttributes } from 'react'
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

export function Link(props: LinkProps) {
  const {
    allowEmptyLink,
    href,
    mobileProps,
    openOnNewTab = true,
    webProps,
    ...otherProps
  } = props

  if (!href && !allowEmptyLink)
    return (
      <View
        {...Platform.select({
          default: {
            ...otherProps,
            ...mobileProps,
          } as any,

          web: {
            ...otherProps,
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
          ...otherProps,
          ...mobileProps,
        } as any,

        web: {
          accessibilityRole: 'link',
          href,
          target: openOnNewTab ? '_blank' : undefined,
          ...otherProps,
          ...webProps,
        } as any,
      })}
    />
  )
}
