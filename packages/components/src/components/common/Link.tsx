import React, { AnchorHTMLAttributes } from 'react'
import { Animated, View } from 'react-native'

import { Browser } from '../../libs/browser'
import { Platform } from '../../libs/platform'
import { AnimatedTouchableOpacity } from '../animated/AnimatedTouchableOpacity'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

export interface LinkProps extends TouchableOpacityProps {
  allowEmptyLink?: boolean
  animated?: boolean
  href?: string
  mobileProps?: TouchableOpacityProps
  openOnNewTab?: boolean
  webProps?: AnchorHTMLAttributes<HTMLAnchorElement>
}

export function Link(props: LinkProps) {
  const {
    allowEmptyLink,
    animated,
    href,
    mobileProps,
    openOnNewTab = true,
    webProps,
    ...otherProps
  } = props

  const ViewComponent = animated ? Animated.View : View
  const TouchableOpacityComponent = animated
    ? AnimatedTouchableOpacity
    : TouchableOpacity

  if (!href && !allowEmptyLink) {
    return (
      <ViewComponent
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
  }

  return (
    <TouchableOpacityComponent
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
