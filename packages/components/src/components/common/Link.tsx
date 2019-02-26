import React, { AnchorHTMLAttributes, useRef } from 'react'
import { View } from 'react-native'

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
    href,
    mobileProps,
    openOnNewTab: _openOnNewTab = true,
    webProps,
    enableBackgroundHover,
    enableForegroundHover,
    hoverBackgroundThemeColor,
    ...otherProps
  } = props

  const openOnNewTab = _openOnNewTab || Platform.isElectron

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
    if (!(enableBackgroundHover || enableForegroundHover)) return

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

  const renderTouchable = href || otherProps.onPress || allowEmptyLink

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
          target: openOnNewTab ? '_blank' : '_self',
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

  if (!renderTouchable) return <SpringAnimatedView ref={ref} {...finalProps} />
  return <SpringAnimatedTouchableOpacity ref={ref} {...finalProps} />
}
