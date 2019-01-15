import React, { AnchorHTMLAttributes, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import { Omit } from '@devhub/core'
import { useHover } from '../../hooks/use-hover'
import { Browser } from '../../libs/browser'
import { Linking } from '../../libs/linking'
import { Platform } from '../../libs/platform'
import { AnimatedView } from '../animated/AnimatedView'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

export interface LinkProps
  extends Omit<TouchableOpacityProps, 'analyticsLabel'> {
  allowEmptyLink?: boolean
  analyticsLabel?: TouchableOpacityProps['analyticsLabel']
  animated?: boolean
  enableBackgroundHover?: boolean
  enableForegroundHover?: boolean
  hoverBackgroundColor?: string
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
    enableBackgroundHover,
    enableForegroundHover,
    hoverBackgroundColor,
    ...otherProps
  } = props

  const ref = useRef(null)
  const isHovered = useHover(
    enableBackgroundHover || enableForegroundHover ? ref : null,
  )

  const ViewComponent = animated ? AnimatedView : View

  const renderTouchable = href || allowEmptyLink

  let finalProps: any

  if (renderTouchable) {
    finalProps = {
      ...(analyticsLabel
        ? {
            analyticsCategory: 'link',
            analyticsAction: 'click',
            analyticsLabel,
          }
        : {}),
      ...Platform.select({
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
          selectable: true,
          target: openOnNewTab ? '_blank' : undefined,
          ...otherProps,
          ...webProps,
        } as any,
      }),
    }
  } else {
    finalProps = Platform.select({
      default: {
        ...otherProps,
        ...mobileProps,
      } as any,

      web: {
        ...otherProps,
        ...webProps,
      } as any,
    })
  }

  if (isHovered && hoverBackgroundColor) {
    finalProps.style = StyleSheet.flatten([
      finalProps.style,
      { backgroundColor: hoverBackgroundColor },
    ])
  }

  if (!renderTouchable) return <ViewComponent ref={ref} {...finalProps} />
  return <TouchableOpacity ref={ref} animated={animated} {...finalProps} />
}
