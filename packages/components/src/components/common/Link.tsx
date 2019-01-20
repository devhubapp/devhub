import React, { AnchorHTMLAttributes, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import { Omit, ThemeColors } from '@devhub/core'
import { rgba } from 'polished'
import { useHover } from '../../hooks/use-hover'
import { Browser } from '../../libs/browser'
import { Linking } from '../../libs/linking'
import { Platform } from '../../libs/platform'
import {
  SpringAnimatedTouchableOpacity,
  SpringAnimatedTouchableOpacityProps,
} from '../animated/spring/SpringAnimatedTouchableOpacity'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useTheme } from '../context/ThemeContext'

export interface LinkProps
  extends Omit<SpringAnimatedTouchableOpacityProps, 'analyticsLabel'> {
  allowEmptyLink?: boolean
  analyticsLabel?: SpringAnimatedTouchableOpacityProps['analyticsLabel']
  animated?: boolean
  enableBackgroundHover?: boolean
  enableForegroundHover?: boolean
  hoverBackgroundThemeColor?: keyof ThemeColors
  href?: string
  mobileProps?: SpringAnimatedTouchableOpacityProps
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
    hoverBackgroundThemeColor,
    ...otherProps
  } = props

  const initialTheme = useTheme(theme => {
    cacheRef.current.theme = theme
    updateStyles()
  })

  const ref = useRef<View>(null)
  useHover(
    enableBackgroundHover || enableForegroundHover ? ref : null,
    isHovered => {
      cacheRef.current.isHovered = isHovered
      updateStyles()
    },
  )

  const cacheRef = useRef({ theme: initialTheme, isHovered: false })

  function updateStyles() {
    const { isHovered, theme } = cacheRef.current

    if (ref.current) {
      const hoverBackgroundColor =
        hoverBackgroundThemeColor && theme[hoverBackgroundThemeColor]

      ref.current!.setNativeProps({
        style: {
          backgroundColor: hoverBackgroundColor
            ? isHovered
              ? hoverBackgroundColor
              : rgba(hoverBackgroundColor, 0)
            : null,
        },
      })
    }
  }

  const ViewComponent = animated ? SpringAnimatedView : View
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

  finalProps.style = StyleSheet.flatten(finalProps.style)

  if (!renderTouchable) return <ViewComponent ref={ref} {...finalProps} />
  return <SpringAnimatedTouchableOpacity ref={ref} {...finalProps} />
}
