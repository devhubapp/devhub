import React, { AnchorHTMLAttributes } from 'react'
import { Animated, Linking, View } from 'react-native'

import { Omit } from '@devhub/core'
import { Browser } from '../../libs/browser'
import { Platform } from '../../libs/platform'
import { AnimatedTouchableOpacity } from '../animated/AnimatedTouchableOpacity'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

export interface LinkProps
  extends Omit<TouchableOpacityProps, 'analyticsLabel'> {
  analyticsLabel?: TouchableOpacityProps['analyticsLabel']
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
    analyticsLabel,
    animated,
    href,
    mobileProps,
    openOnNewTab = true,
    webProps,
    ...otherProps
  } = props

  const ViewComponent = animated ? Animated.View : View
  const TouchableOpacityComponent = animated
    ? (AnimatedTouchableOpacity as React.ComponentType<TouchableOpacityProps>)
    : (TouchableOpacity as React.ComponentType<TouchableOpacityProps>)

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
      {...(analyticsLabel
        ? {
            analyticsCategory: 'link',
            analyticsAction: 'click',
            analyticsLabel,
          }
        : {})}
      {...Platform.select({
        default: {
          onPress: href
            ? href.includes('http')
              ? () => Browser.openURL(href)
              : () => Linking.openURL(href)
            : undefined,
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
