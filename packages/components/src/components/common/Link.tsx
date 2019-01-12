import React, { AnchorHTMLAttributes } from 'react'
import { View } from 'react-native'

import { Omit } from '@devhub/core'
import { Browser } from '../../libs/browser'
import { Linking } from '../../libs/linking'
import { Platform } from '../../libs/platform'
import { AnimatedView } from '../animated/AnimatedView'
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

  const ViewComponent = animated ? AnimatedView : View

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
    <TouchableOpacity
      animated={animated}
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
            ? href.startsWith('http')
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
